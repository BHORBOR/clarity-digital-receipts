;; Digital Receipt Storage System

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-receipt (err u101))
(define-constant err-receipt-not-found (err u102))

;; Data structures
(define-map receipts
    { receipt-id: uint }
    {
        merchant: (string-ascii 100),
        amount: uint,
        date: uint,
        description: (string-ascii 500),
        owner: principal
    }
)

(define-data-var receipt-counter uint u0)

;; Private functions
(define-private (is-owner)
    (is-eq tx-sender contract-owner)
)

;; Public functions
(define-public (store-receipt (merchant (string-ascii 100)) (amount uint) (date uint) (description (string-ascii 500)))
    (let
        (
            (receipt-id (+ (var-get receipt-counter) u1))
        )
        (try! (map-insert receipts
            { receipt-id: receipt-id }
            {
                merchant: merchant,
                amount: amount,
                date: date,
                description: description,
                owner: tx-sender
            }
        ))
        (var-set receipt-counter receipt-id)
        (ok receipt-id)
    )
)

(define-public (get-receipt (receipt-id uint))
    (match (map-get? receipts { receipt-id: receipt-id })
        receipt (if (is-eq tx-sender (get owner receipt))
            (ok receipt)
            err-invalid-receipt
        )
        err-receipt-not-found
    )
)

(define-read-only (get-total-receipts)
    (ok (var-get receipt-counter))
)

(define-public (delete-receipt (receipt-id uint))
    (let (
        (receipt (map-get? receipts { receipt-id: receipt-id }))
    )
    (match receipt
        existing-receipt (if (is-eq tx-sender (get owner existing-receipt))
            (begin
                (map-delete receipts { receipt-id: receipt-id })
                (ok true)
            )
            err-invalid-receipt
        )
        err-receipt-not-found
    ))
)
