from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def realizar_sorteo():
    with open('sguidores.txt', 'r') as file:
        participantes = [line.strip() for line in file]
    
    ganadores = random.sample(participantes, min(16, len(participantes)))
    return ganadores

@app.route('/sorteo', methods=['GET'])
def sorteo():
    ganadores = realizar_sorteo()
    return jsonify({'ganadores': ganadores})

if __name__ == '__main__':
    app.run(debug=True)