package br.com.task.manager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração de CORS para o Spring Boot.
 * Permite que o frontend (executando em uma porta diferente) acesse o backend.
 * Sem esta configuração, o navegador bloqueia a requisição (erro status 0).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configurações de CORS para desenvolvimento:
        // Permite requisições de qualquer origem para os endpoints da API.
        registry.addMapping("/api/**") // Aplica a configuração a todos os endpoints sob /api/
                .allowedOrigins("*") // Permite qualquer origem (para desenvolvimento)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*"); // Headers permitidos
    }
}
