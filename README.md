# Digital Receipt Storage System

A blockchain-based solution for storing and managing digital receipts securely on the Stacks blockchain.

## Features

- Store digital receipts with merchant information, amount, date, and description
- Retrieve receipts securely (only accessible by the receipt owner)
- Delete receipts when no longer needed
- Track total number of receipts stored
- Privacy-focused design where each user can only access their own receipts

## Technical Details

The smart contract implements:
- Secure receipt storage using principal-based ownership
- Receipt data structure with merchant details, amount, date and description
- Error handling for unauthorized access attempts
- Receipt deletion functionality
