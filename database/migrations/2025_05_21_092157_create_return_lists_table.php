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
        Schema::create('return_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_list_id')->constrained('purchase_lists')->onDelete('cascade');
            $table->string('item_name');
            $table->date('return_date');
            $table->integer('price');
            $table->text('narration');
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
        Schema::dropIfExists('return_lists');
    }
};
