import os
from openai import OpenAI

class LLMService:
    def __init__(self):
        # Ensure OPENAI_API_KEY is set in your environment variables
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("WARNING: OPENAI_API_KEY not found in environment variables.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)

    def generate_response(self, prompt: str, max_tokens: int = 512, temperature: float = 0.7):
        """
        Generates a response using OpenAI's gpt-4o-mini model.
        """
        if not self.client:
            return "Error: OPENAI_API_KEY is not set. Please configure it in the backend environment."

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful Business Analyst AI Agent for ForteBank."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error calling OpenAI API: {str(e)}"

# Singleton instance
llm_service = None

def get_llm_service():
    global llm_service
    if llm_service is None:
        llm_service = LLMService()
    return llm_service
