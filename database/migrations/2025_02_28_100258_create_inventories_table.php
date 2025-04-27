<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('item_name')->nullable();
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->decimal('buying_price', 10, 2)->default(0);
            $table->string('item_type')->nullable();
            $table->integer('count')->default(0);
            $table->json('item_dimensions')->nullable();
            $table->string('item_sub_type')->nullable();
            $table->string('description')->nullable();
            $table->tinyInteger('created_by')->nullable();
            $table->tinyInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
