package br.com.task.manager.config;

import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuração de Segurança para a API.
 * Configurada no MODO DE DESENVOLVIMENTO.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configuração de segurança principal para a aplicação.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 1. Desabilita CSRF
        http.csrf(AbstractHttpConfigurer::disable);

        // 2. CRÍTICO: Habilita CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 3. Configura autorização
        http.authorizeHttpRequests(auth -> auth
                // Permite requisições OPTIONS (preflight CORS)
                .requestMatchers("OPTIONS", "/**").permitAll()
                // Permite endpoints do Actuator
                .requestMatchers("/actuator/**").permitAll()
                // Permite todas as rotas da API
                .requestMatchers("/api/**").permitAll()
                // Qualquer outra requisição requer autenticação
                .anyRequest().authenticated()
        );

        // 4. Sessão STATELESS
        http.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // 5. Desabilita form-login
        http.formLogin(AbstractHttpConfigurer::disable);

        // 6. Desabilita httpBasic
        http.httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    /**
     * CRÍTICO: Bean separado para o Actuator Management Security.
     * Sem este bean, o Spring Boot Actuator falha ao inicializar.
     */
    @Bean
    public SecurityFilterChain managementSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * Configuração de CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permite origens específicas
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:4200",
            "http://localhost:8080",
            "http://127.0.0.1:4200",
            "http://127.0.0.1:8080"
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"
        ));

        // Headers permitidos
        configuration.setAllowedHeaders(List.of("*"));

        // Headers expostos
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Authorization"
        ));

        // Permite credenciais
        configuration.setAllowCredentials(true);

        // Cache do preflight
        configuration.setMaxAge(3600L);

        // Aplica para todos os endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * PasswordEncoder bean.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * UserDetailsService em memória.
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder.encode("password"))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}
