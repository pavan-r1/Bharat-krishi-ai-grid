import unittest

import httpx
from google.genai.errors import ServerError

from app.api.chatbot import ChatRequest, _redact_sensitive
from app.services.local_chat_fallback import detect_language, local_reply
from app.services.gemini_service import GeminiConfigurationError, GeminiRequestError, _provider_error


class ChatbotTests(unittest.TestCase):
    def test_request_limits_messages_and_history(self):
        self.assertEqual(ChatRequest(message="  Hello  ").message, "Hello")
        self.assertEqual(ChatRequest(message="ಬೆಲೆ", language="kn").language, "kn")
        with self.assertRaises(Exception):
            ChatRequest(message=" ")
        with self.assertRaises(Exception):
            ChatRequest(message="Hi", history=[{"role": "user", "text": "x"}] * 9)

    def test_sensitive_values_are_redacted_before_provider_call(self):
        safe = _redact_sensitive("My password is Secret123 and OTP is 123456, call +91 9876543210")
        self.assertNotIn("Secret123", safe)
        self.assertNotIn("123456", safe)
        self.assertNotIn("9876543210", safe)

    def test_provider_unavailability_remains_a_service_unavailable_response(self):
        error = ServerError(503, {"error": {"code": 503, "status": "UNAVAILABLE", "message": "High demand."}})
        mapped = _provider_error(error)
        self.assertIsInstance(mapped, GeminiRequestError)
        self.assertEqual(mapped.status_code, 503)
        self.assertEqual(mapped.category, "provider_unavailable")

    def test_provider_quota_model_credentials_and_permission_errors_are_distinct(self):
        cases = [
            (type("QuotaError", (Exception,), {"code": 429, "status": "RESOURCE_EXHAUSTED"})(), 429, "quota_exhausted"),
            (type("ModelError", (Exception,), {"code": 404, "status": "NOT_FOUND"})(), 503, "model_unavailable"),
            (type("InvalidKey", (Exception,), {"code": 400, "message": "API key not valid."})(), 503, "invalid_api_key"),
            (type("PermissionError", (Exception,), {"code": 403, "status": "PERMISSION_DENIED"})(), 503, "permission_denied"),
            (httpx.ConnectTimeout("timed out"), 504, "network_timeout"),
            (httpx.ConnectError("network down"), 502, "network_error"),
        ]
        for provider_error, status_code, category in cases:
            with self.subTest(category=category):
                mapped = _provider_error(provider_error)
                self.assertEqual(mapped.status_code, status_code)
                self.assertEqual(mapped.category, category)
                if category in {"model_unavailable", "invalid_api_key", "permission_denied"}:
                    self.assertIsInstance(mapped, GeminiConfigurationError)

    def test_local_fallback_answers_in_english_kannada_and_hindi(self):
        english = local_reply("How can I compare mandi prices?", "en")
        kannada = local_reply("ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಹೇಗೆ ಹೋಲಿಸಲಿ?", "auto")
        hindi = local_reply("मंडी भाव की तुलना कैसे करें?", "auto")
        self.assertIn("modal price", english)
        self.assertIn("ಮಾದರಿ ಬೆಲೆ", kannada)
        self.assertIn("मॉडल भाव", hindi)
        self.assertEqual(detect_language("ಬೆಲೆ", "auto"), "kn")
        self.assertEqual(detect_language("मंडी भाव", "auto"), "hi")


if __name__ == "__main__":
    unittest.main()
