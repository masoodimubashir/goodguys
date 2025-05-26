<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChallanRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'id' => [
                'required',
                'integer',
                Rule::exists('challan_refrences', 'id')
            ],
            'purchase_list_id' => [
                'required',
                'integer',
                Rule::exists('purchase_lists', 'id')
            ],
            'purchase_list' => 'required|array',
            'purchased_products' => 'sometimes|array|min:1',
            'return_lists' => 'sometimes|array|min:1',
        ];
    }

}
