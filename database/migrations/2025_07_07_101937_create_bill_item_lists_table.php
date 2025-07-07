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
        Schema::create('bill_item_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_list_id')->constrained('purchase_lists')->cascadeOnDelete();
            $table->string('item_description');
            $table->integer('item_quantity');
            $table->integer('item_price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_item_lists');
    }
};
