package com.davidmnj91.pagantis.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditTransfer {
    private String fromWalletId;
    private String toWalletId;
    private double amount;
}
