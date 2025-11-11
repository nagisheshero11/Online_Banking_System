package com.banking.server;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ServerApplication {

	// Injects the port value from application.properties
	@Value("${server.port}")
	private int port;

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	// Event fires once the web server starts
	@EventListener(WebServerInitializedEvent.class)
	public void onServerStart(WebServerInitializedEvent event) {
		System.out.println("Server started successfully on port: " + port);
	}
}