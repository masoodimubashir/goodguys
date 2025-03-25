<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_name' => fake()->name(),
            'selling_price' => fake()->randomFloat(2, 1, 8),
            'buying_price' => fake()->randomFloat(2, 1, 8),
            'item_type' => fake()->randomElement(['Furniture', 'Electronics', 'Clothing', 'Books', 'Other']),
            'item_dimension' => fake()->randomElement(['Length', 'Breadth', 'Height']),
            'item_size' => fake()->randomFloat(2, 1, 8),
            'count' => fake()->randomNumber(2),
            'created_by' => 1,
        ];
    }
}
