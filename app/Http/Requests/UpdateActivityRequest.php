<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
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
            'unit_type' => 'nullable|string',
            'description' => 'required|string',
            'qty' => 'required|integer',
            'price' => 'required|integer',
            'narration' => 'nullable|string',
            'total' => 'required|integer',
            'created_at' => 'required|date',
            'multiplier' => 'required|integer|min:1',
        ];
    }
}
