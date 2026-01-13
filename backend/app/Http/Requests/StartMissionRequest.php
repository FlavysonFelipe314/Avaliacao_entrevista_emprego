<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartMissionRequest extends FormRequest
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
            'driverId' => ['required', 'integer', 'exists:drivers,id'],
            'vehicleId' => ['required', 'integer', 'exists:vehicles,id'],
            'observations' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
