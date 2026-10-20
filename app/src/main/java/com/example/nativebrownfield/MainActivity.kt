package com.example.nativebrownfield

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var statusTextView: TextView
    private lateinit var messageEditText: EditText
    private lateinit var sendButton: Button
    private lateinit var openExpoButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusTextView = findViewById(R.id.statusTextView)
        messageEditText = findViewById(R.id.messageEditText)
        sendButton = findViewById(R.id.sendButton)
        openExpoButton = findViewById(R.id.openExpoButton)

        CommunicationModule.onMessageReceivedListener = { message ->
            runOnUiThread {
                statusTextView.text = "Received from Expo:\n$message"
            }
        }

        sendButton.setOnClickListener {
            val textToSend = messageEditText.text.toString().ifEmpty { "Hello from Native Android!" }
            CommunicationModule.sendEvent("NativeToExpoEvent", textToSend)
            statusTextView.text = "Sent to Expo:\n$textToSend"
        }

        openExpoButton.setOnClickListener {
            val intent = Intent(this, MyReactActivity::class.java)
            startActivity(intent)
        }
    }
}
