package com.cafeteria.rm.service;

import com.cafeteria.rm.dto.request.LoginRequest;
import com.cafeteria.rm.dto.request.RegisterRequest;
import com.cafeteria.rm.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
