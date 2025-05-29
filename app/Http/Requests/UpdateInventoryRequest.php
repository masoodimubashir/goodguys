<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryRequest extends FormRequest
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
            'item_name'         => ['bail', 'required', 'string', 'min:3', 'max:100'],
            'selling_price'     => ['bail', 'required', 'numeric', 'min:1'],
            'buying_price'      => ['bail', 'required', 'numeric', 'min:1'],
            'item_type'         => ['bail', 'required', 'string', 'min:3', 'max:100'],
            'item_sub_type'     => ['required', 'string', 'max:100'],
            'description'       => ['required', 'string', 'max:1000'],
            'count'             => ['bail', 'required', 'integer', 'min:1'],
            'item_dimensions'                 => ['bail', 'required', 'array', 'min:1', 'max:3'],
            'item_dimensions.*.type'          => ['required', 'string', 'min:1', 'max:50'],
            'item_dimensions.*.value'         => ['required', 'numeric', 'min:0.1'],
            'item_dimensions.*.unit'          => ['required', 'string'],
        ];
    }


    public function messages(): array
    {
        return [
            // Item Name
            'item_name.required'        => 'Item name is required.',
            'item_name.min'             => 'Item name must be at least :min characters.',
            'item_name.max'             => 'Item name may not exceed :max characters.',

            // Selling Price
            'selling_price.required'    => 'Selling price is required.',
            'selling_price.numeric'     => 'Selling price must be a number.',
            'selling_price.min'         => 'Selling price must be at least :min.',

            // Buying Price
            'buying_price.required'     => 'Buying price is required.',
            'buying_price.numeric'      => 'Buying price must be a number.',
            'buying_price.min'          => 'Buying price must be at least :min.',

            // Item Type
            'item_type.required'        => 'Item type is required.',
            'item_type.min'             => 'Item type must be at least :min characters.',
            'item_type.max'             => 'Item type may not exceed :max characters.',

            // Item Sub Type
            'item_sub_type.string'      => 'Item sub type must be a valid string.',
            'item_sub_type.max'         => 'Item sub type may not exceed :max characters.',

            // Description
            'description.string'        => 'Description must be a valid string.',
            'description.max'           => 'Description may not exceed :max characters.',

            // Count
            'count.required'            => 'Item count is required.',
            'count.integer'             => 'Item count must be a whole number.',
            'count.min'                 => 'Item count must be at least :min.',

            // Dimensions
            'item_dimensions.required'             => 'At least one dimension is required.',
            'item_dimensions.array'                => 'Item dimensions must be an array.',
            'item_dimensions.min'                  => 'You must provide at least :min dimension(s).',
            'item_dimensions.max'                  => 'You can provide up to :max dimensions only.',

            'item_dimensions.*.type.required'      => 'Each dimension must have a type.',
            'item_dimensions.*.type.string'        => 'Dimension type must be a string.',
            'item_dimensions.*.type.min'           => 'Dimension type must be at least :min characters.',
            'item_dimensions.*.type.max'           => 'Dimension type may not exceed :max characters.',

            'item_dimensions.*.value.required'     => 'Each dimension must have a value.',
            'item_dimensions.*.value.numeric'      => 'Dimension value must be numeric.',
            'item_dimensions.*.value.min'          => 'Dimension value must be at least :min.',

            'item_dimensions.*.unit.required'      => 'Each dimension must have a unit.',
            'item_dimensions.*.unit.in'            => 'Dimension unit must be one of the following: mm, cm, m, in, ft.',
        ];
    }
    
    
}
