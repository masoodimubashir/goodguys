<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    @include('layout.head')


    @include('layout.css')

    @routes

    @viteReactRefresh   


    {{-- <script type="module" src="{{ asset('build/assets/app-BAG-bvi1.js') }}"></script> --}}
    {{-- <link rel="stylesheet" href="{{ asset('build/assets/app-Dvf4vD2e.css') }}"> --}}


    {{-- <link rel="stylesheet" href="{{ asset('build/assets/app-P2nxT-ty.js') }}"> --}}

    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]) 

    @inertiaHead

</head>

<body class="font-sans antialiased">
    @inertia

    @include('layout.script')


</body>
</html>
