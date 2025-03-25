<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryRequest extends FormRequest
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
            'item_name' => 'bail|required|string|min:3|max:100',
            'selling_price' => 'bail|required|numeric|min:1',
            'buying_price' => 'bail|required|numeric|min:1',
            'item_type' => 'bail|required|string|min:3|max:100',
            'count' => 'bail|required|integer|min:1',
            'attributes' => ['bail', 'required', 'array', 'min:1', 'max:3'],
            'attributes.*.dimension' => 'required|string|min:1|max:50',
            'attributes.*.size' => 'required|string|min:1|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'attributes.required' => 'The attributes field is required.',
            'attributes.array' => 'The attributes field must be an array.',
            'attributes.min' => 'You must provide at least :min attribute(s).',
            'attributes.max' => 'You can provide up to :max attributes only.',
            'attributes.*.dimension.required' => 'Dimension is required.',
            'attributes.*.size.required' => 'Size is required.',
        ];
    }
}
