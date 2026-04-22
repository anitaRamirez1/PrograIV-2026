<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Gestión de Pasantías y Empresas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Outfit', sans-serif; 
            background-color: #f0f2f5; 
        }
        .bg-wine { background-color: #722f37 !important; color: white; }
        .text-wine { color: #722f37 !important; }
        .btn-wine { background-color: #722f37; border-color: #722f37; color: white; }
        .btn-wine:hover { background-color: #5c252c; border-color: #5c252c; color: white;}
        .btn-outline-wine { border-color: #722f37; color: #722f37; }
        .btn-outline-wine:hover { background-color: #722f37; color: white; }
        
        .bg-blue { background-color: #0047AB !important; color: white; }
        .text-blue { color: #0047AB !important; }
        .btn-blue { background-color: #0047AB; border-color: #0047AB; color: white; }
        .btn-blue:hover { background-color: #003380; color: white; border-color: #003380; }
        .btn-outline-blue { border-color: #0047AB; color: #0047AB; }
        .btn-outline-blue:hover { background-color: #0047AB; color: white; }

        .card { border-radius: 16px; overflow: hidden; border: none; box-shadow: 0 10px 20px rgba(0,0,0,0.08); transition: transform 0.2s;}
        .card-header { padding: 1.25rem 1.5rem; border-bottom: none!important; }
        
        .nav-tabs { border-bottom: 2px solid #dee2e6; gap: 10px; }
        .nav-tabs .nav-link { 
            font-weight: 600; 
            color: #6c757d; 
            padding: 1rem 2.5rem; 
            border: none;
            border-radius: 12px 12px 0 0; 
            background: #e9ecef;
            transition: all 0.3s;
        }
        .nav-tabs .nav-link:hover { background: #dee2e6; color: #0047AB; }
        .nav-tabs .nav-link.active { 
            color: #722f37; 
            background-color: white;
            border-top: 4px solid #722f37;
            font-size: 1.05rem;
            box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
        }
    </style>
    @vite(['resources/js/app.js'])
</head>
<body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
