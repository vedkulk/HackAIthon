from flask import Flask, request, jsonify, render_template
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Spotify API setup
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
You listen actively, validate their feelings, and respond with empathy and warmth.
You ask open-ended, reflective questions to help them explore their emotions and thoughts.
You never diagnose but instead guide with patience and kindness.
When appropriate, offer gentle coping strategies.
Always end each conversation with hope and reassurance.
"""

helpline_info = """
📞 **Indian Mental Health Helplines:**
1. AASRA: 91-9820466726 (24x7)
2. Snehi Helpline: +91-9582208181
3. Fortis 24x7 Mental Health Helpline: +91-8376804102
4. Sumaitri Helpline (Delhi): 91-11-23389090
5. Vandrevala Foundation Helpline: 1860 266 2345 or 9999 666 555
👉 Please remember, you are not alone — help is just one call away.
"""

chat = model.start_chat(history=[])
chat.send_message(system_prompt)


def search_playlist(mood_query):
    results = sp.search(q=mood_query, type='playlist', limit=1)
    if results['playlists']['items']:
        playlist = results['playlists']['items'][0]
        playlist_name = playlist['name']
        playlist_url = playlist['external_urls']['spotify']
        return f"Here's a {mood_query} playlist: {playlist_name} — {playlist_url}"
    else:
        return "I couldn't find a playlist at the moment, but I can still suggest some relaxing music if you'd like!"


def suggest_dynamic_music(concern_level):
    mood_map = {
        "low": "focus chill",
        "medium": "lofi relaxing",
        "high": "calming piano nature sounds"
    }
    mood_query = mood_map.get(concern_level.lower(), "relaxing")
    return search_playlist(mood_query)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat_with_neura():
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
    app.run(debug=True)