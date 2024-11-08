<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function respond(Request $request)
    {
        $userMessage = strtolower($request->input('message'));

        // Basic responses based on keywords
        $response = $this->getResponse($userMessage);

        return response()->json([
            'reply' => $response
        ]);
    }

    private function getResponse($message)
    {
        if (strpos($message, 'hello') !== false) {
            return "Hello! How can I help you today?";
        } elseif (strpos($message, 'how are you') !== false) {
            return "I'm just a bot, but thank you for asking! How can I assist you?";
        } elseif (strpos($message, 'weather') !== false) {
            return "I'm unable to fetch the current weather. Please check a weather website!";
        } elseif (strpos($message, 'time') !== false) {
            return "The current server time is: " . now()->toDateTimeString();
        } elseif (strpos($message, 'bye') !== false) {
            return "Goodbye! Have a nice day!";
        } else {
            return "I'm sorry, I didn't understand that. Can you please rephrase?";
        }
    }
}
