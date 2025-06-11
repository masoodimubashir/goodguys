<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Inventory::factory(10)->create();

        $this->call(LaratrustSeeder::class);

        // Then create admin user
        $admin = User::create([
            'name' => 'GoodGuys',
            'email' => 'goodguys@gmail.com',
            'password' => bcrypt('goodguys'),
            'email_verified_at' => now(),
            'remember_token' => 1,
        ]);

        $admin->addRole('admin');

        $permissions = [
            'users-create',
            'users-read',
            'users-update',
            'users-delete'
        ];

        $admin->givePermissions($permissions);
    }
}
