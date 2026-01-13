<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
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
            'codigo' => ['required', 'string', 'max:50', 'unique:vehicles,codigo'],
            'placa' => ['required', 'string', 'max:10', 'unique:vehicles,placa'],
            'modelo' => ['nullable', 'string', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:available,active,maintenance,inactive'],
        ];
    }
}
