<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'type' => ['required', 'in:income,expense'],
            'category' => ['required', 'in:fuel,maintenance,salaries,others'],
            'recipient' => ['nullable', 'string', 'max:255'],
            'observations' => ['nullable', 'string'],
            'transaction_date' => ['required', 'date'],
        ];
    }
}
