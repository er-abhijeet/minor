import requests
import matplotlib.pyplot as plt
from PIL import Image

# Hugging Face API details
API_URL = "https://api-inference.huggingface.co/models/dima806/indian_food_image_detection"
headers = {"Authorization": "Bearer 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"}

def query(image_path):
    with open(image_path, "rb") as f:
        image_data = f.read()
    response = requests.post(API_URL, headers=headers, data=image_data)
    return response.json()

# Path to your image
image_path = "minor/ui/src/images.jpeg"

# Run inference
result = query(image_path)

# Load image
image = Image.open(image_path)

# Extract prediction
predicted_label = result[0]["label"]
confidence = result[0]["score"]

# Display image with prediction
plt.figure(figsize=(6,6))
plt.imshow(image)
plt.axis("off")  # Hide axes
plt.title(f"Prediction: {predicted_label}\nConfidence: {confidence:.2f}", fontsize=14, color="blue")
plt.show()
