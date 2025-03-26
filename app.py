from flask import Flask, request, jsonify, render_template
import torch
from transformers import pipeline

app = Flask(__name__)

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
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze the sentiment of input paragraphs."""
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


if __name__ == '__main__':
    app.run(port=5000)
