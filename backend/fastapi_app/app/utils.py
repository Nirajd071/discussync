
from passlib.context import CryptContext
import re

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Extract mentions from text
def extract_mentions(text):
    """Extract mentions from text (words starting with @)"""
    mention_pattern = re.compile(r'@(\w+)')
    return mention_pattern.findall(text)
