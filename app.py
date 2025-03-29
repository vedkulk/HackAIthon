from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import torch
from transformers import pipeline
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# ✅ Set device compatibility
device = "mps" if torch.backends.mps.is_available() else "cpu"

# ✅ Load public emotion detection model
suicide_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    device=0 if device == "mps" else -1
)

# ✅ Sentiment mapping function with clamping
def analyze_sentiment(paragraphs):
    scores = []
    
    for paragraph in paragraphs:
        if not paragraph.strip():
            scores.append(0.0)  # Empty paragraphs get neutral score
            continue
        
        result = suicide_pipeline(paragraph)[0]
        label = result['label'].lower()
        score = result['score']

        # ✅ Map emotion labels to sentiment scores
        if label in ['sadness', 'fear']:
            sentiment_score = -1.0 + score  # Negative range
        elif label in ['joy', 'love']:
            sentiment_score = 0.1 + score  # Positive range
        elif label in ['anger']:
            sentiment_score = -0.5 + (score * 0.5)  # Moderately negative
        else:  # Neutral or mixed
            sentiment_score = 0.0

        # 🚫 Clamp scores between -1.0 and 1.0
        clamped_score = max(-1.0, min(1.0, sentiment_score))
        scores.append(round(clamped_score, 2))

    return scores


@app.route('/')
def index():
    """Render the frontend HTML."""
    return "Index Page"  # You might want to adjust this based on your needs


@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    """Analyze the sentiment of input paragraphs."""
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        }

    data = request.json
    paragraphs = data.get('paragraphs', [])

    if not paragraphs:
        return jsonify({'error': 'No paragraphs provided'}), 400

    try:
        # ✅ Analyze sentiment with clamped scores
        scores = analyze_sentiment(paragraphs)

        # ✅ Prepare timeline data for frontend
        timeline_data = [
            {"time": f"Post {i + 1}", "emotion_score": score}
            for i, score in enumerate(scores)
        ]

        return jsonify(timeline_data)


    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET))

# Gemini setup
gemini_api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

system_prompt = """
You are a compassionate, professional clinical psychologist with expertise in mental health counseling.
Your role is to have thoughtful, supportive conversations with people who may be experiencing stress, anxiety, sadness, depression, or confusion.
"""

helpline_info = """
📞 **Indian Mental Health Helplines:**
1. AASRA: 91-9820466726 (24x7)
2. Snehi Helpline: +91-9582208181
3. Fortis 24x7 Mental Health Helpline: +91-8376804102
"""

chat = model.start_chat(history=[])
chat.send_message(system_prompt)

def search_playlist(mood_query):
    results = sp.search(q=mood_query, type='playlist', limit=1)
    if results['playlists']['items']:
        playlist = results['playlists']['items'][0]
        return f"Here's a {mood_query} playlist: {playlist['name']} — {playlist['external_urls']['spotify']}"
    else:
        return "I couldn't find a playlist at the moment."

def suggest_dynamic_music(concern_level):
    mood_map = {
        "low": "focus chill",
        "medium": "lofi relaxing",
        "high": "calming piano nature sounds"
    }
    return search_playlist(mood_map.get(concern_level.lower(), "relaxing"))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['OPTIONS', 'POST'])
def chat_with_neura():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'CORS preflight request successful'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200

    response = jsonify({})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")  # ✅ Allow frontend requests
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message in request'}), 400

    user_input = data.get('message', '')

    if user_input.lower() in ["help", "emergency", "helpline"]:
        return jsonify({'response': helpline_info})

    if "play music" in user_input.lower() or "music" in user_input.lower():
        return jsonify({'response': "Could you tell me your current mood? (High / Medium / Low)", 'ask_mood': True})

    mood = data.get('mood')
    if mood:
        playlist_response = suggest_dynamic_music(mood)
        return jsonify({'response': playlist_response})

    response = chat.send_message(user_input)
    cleaned_response = " ".join(response.text.strip().splitlines())
    
    return jsonify({'response': cleaned_response})


if __name__ == "__main__":
    app.run(debug=True, port=500)
