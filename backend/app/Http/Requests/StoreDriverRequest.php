<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
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
            'codigo' => ['required', 'string', 'max:50', 'unique:drivers,codigo'],
            'nome' => ['required', 'string', 'max:255'],
            'cpf' => ['required', 'string', 'size:14', 'unique:drivers,cpf'],
            'telefone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255', 'unique:drivers,email'],
            'password' => ['nullable', 'string', 'min:6'],
            'cnh' => ['nullable', 'string', 'max:11'],
            'especialidade' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:active,inactive,available'],
        ];
    }
}
