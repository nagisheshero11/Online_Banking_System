package com.banking.server.dto;

import lombok.Data;

// * DTO for updating limited user fields.
@Data
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
}