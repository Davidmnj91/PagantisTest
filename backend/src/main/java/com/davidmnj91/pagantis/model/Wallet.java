package com.davidmnj91.pagantis.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {
    private String id;
    private String name;
    private double amount;
}
