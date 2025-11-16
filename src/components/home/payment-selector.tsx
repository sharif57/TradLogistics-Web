'use client'

interface PaymentSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}

export default function PaymentSelector({ selectedMethod, onMethodChange }: PaymentSelectorProps) {
  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'stripe', label: 'Stripe', icon: '💳' },
    { id: 'lynk', label: 'Lynk', icon: '✅' },
    { id: 'jnmoney', label: 'JN Money', icon: '💰' },
  ]

  return (
    <div className="space-y-2">
      {paymentMethods.map(method => (
        <button
          key={method.id}
          onClick={() => onMethodChange(method.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-2 text-left ${
            selectedMethod === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === method.id}
            onChange={() => onMethodChange(method.id)}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
          <span className="text-lg">{method.icon}</span>
          <span className={`text-sm sm:text-base ${selectedMethod === method.id ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            {method.label}
          </span>
        </button>
      ))}
    </div>
  )
}
