from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_EXPIRATION_HOURS'] = 24

# Simple in-memory user database (replace with real database in production)
users_db = {}

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

def generate_token(user_id):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS']),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id'], None
    except jwt.ExpiredSignatureError:
        return None, "Token has expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User signup endpoint"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    
    email = data.get('email').strip().lower()
    password = data.get('password')
    
    # Validate email format
    if not validate_email(email):
        return jsonify({'success': False, 'message': 'Invalid email format'}), 400
    
    # Validate password strength
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({'success': False, 'message': message}), 400
    
    # Check if user already exists
    if email in users_db:
        return jsonify({'success': False, 'message': 'Email already registered'}), 409
    
    # Create new user
    user_id = f"user_{len(users_db) + 1}"
    users_db[email] = {
        'user_id': user_id,
        'email': email,
        'password_hash': generate_password_hash(password),
        'created_at': datetime.utcnow().isoformat(),
        'entries': []
    }
    
    # Generate token
    token = generate_token(user_id)
    
    return jsonify({
        'success': True,
        'message': 'Account created successfully',
        'token': token,
        'user': {
            'user_id': user_id,
            'email': email
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    
    email = data.get('email').strip().lower()
    password = data.get('password')
    
    # Check if user exists
    if email not in users_db:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    user = users_db[email]
    
    # Verify password
    if not check_password_hash(user['password_hash'], password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    # Generate token
    token = generate_token(user['user_id'])
    
    return jsonify({
        'success': True,
        'message': 'Logged in successfully',
        'token': token,
        'user': {
            'user_id': user['user_id'],
            'email': email
        }
    }), 200

@app.route('/api/auth/verify', methods=['POST'])
def verify():
    """Verify token and get user info"""
    data = request.get_json()
    token = data.get('token') if data else None
    
    if not token:
        return jsonify({'success': False, 'message': 'Token is required'}), 400
    
    user_id, error = verify_token(token)
    
    if error:
        return jsonify({'success': False, 'message': error}), 401
    
    # Find user by user_id
    for email, user in users_db.items():
        if user['user_id'] == user_id:
            return jsonify({
                'success': True,
                'user': {
                    'user_id': user_id,
                    'email': user['email']
                }
            }), 200
    
    return jsonify({'success': False, 'message': 'User not found'}), 404

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout (token invalidation handled on frontend)"""
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'OK', 'message': 'Feelflow API is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)