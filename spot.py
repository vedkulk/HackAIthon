import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import google.generativeai as genai

# Spotify API credentials
SPOTIFY_CLIENT_ID = "b2c1025384f44f4ba1f10c5174c04d82"
SPOTIFY_CLIENT_SECRET = "25ce3df8a1dd4fb8a463780b78ab707c"

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID,
                                                           client_secret=SPOTIFY_CLIENT_SECRET))

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

# Gemini setup
api_key = "AIzaSyDhxzDqQ6pXg4hJm0OajFz72JpaRI_vYHc"
genai.configure(api_key=api_key)
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

print("Hello, you've reached NeuroHaven's virtual psychologist, Neura. I'm here to guide you through whatever you're facing. How can I help today?\n")
print("You can talk to Neura anytime — your trusted companion for mental well-being.\n")

waiting_for_mood = False

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("Neura: Take care! Remember, you are never alone.❤️")
        break
    elif user_input.lower() in ["help", "emergency", "helpline"]:
        print(helpline_info)
        continue

    if waiting_for_mood:
        playlist_response = suggest_dynamic_music(user_input)
        print("Neura:", playlist_response)
        waiting_for_mood = False
        continue

    if "play me some music" in user_input.lower() or "play music" in user_input.lower() or "music" in user_input.lower():
        print("Neura: Sure! Could you tell me your current mood? (High / Medium / Low)")
        waiting_for_mood = True
        continue

    # Otherwise, use Gemini to respond as a psychologist
    response = chat.send_message(user_input)
    cleaned_response = " ".join(response.text.strip().splitlines())
    print("Neura:", cleaned_response)
