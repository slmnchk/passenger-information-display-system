package org.example.passengerinformationdisplaysystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://salmanchik.com",
                                "https://salmanchik.com",
                                "http://api.salmanchik.com",
                                "https://api.salmanchik.com",
                                "http://slmnchk.github.io",
                                "https://slmnchk.github.io",
                                "http://localhost:3000",
                                "http://localhost:63342",
                                "http://127.0.0.1:5500")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}