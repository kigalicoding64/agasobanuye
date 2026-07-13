<!DOCTYPE html>
<html lang="rw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agasobanuye Now | Watch & Download Agasobanuye for Free</title>
    <style>
        /* Agasobanuye Now Brand Colors & Reset */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #141414;
            color: #ffffff;
            padding-bottom: 60px;
        }

        /* Top Navigation Bar */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 4%;
            background-color: #0b0b0b;
            border-bottom: 1px solid #222;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .logo {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: 0.5px;
        }

        .logo span {
            color: #ffb703; /* The signature yellow accent from the site */
        }

        nav {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        nav a {
            color: #aaaaaa;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: color 0.2s;
        }

        nav a:hover, nav a.active {
            color: #ffb703;
        }

        .search-container {
            position: relative;
        }

        .search-bar {
            padding: 7px 12px;
            border-radius: 4px;
            border: 1px solid #333;
            background-color: #1f1f1f;
            color: #fff;
            font-size: 14px;
            outline: none;
            width: 200px;
        }

        /* WhatsApp Community Banner */
        .whatsapp-banner {
            background-color: #075e54;
            color: white;
            padding: 12px 4%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }

        .whatsapp-btn {
            background-color: #25d366;
            color: black;
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            font-size: 13px;
        }

        /* Main Catalog Layout */
        main {
            padding: 30px 4%;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-left: 4px solid #ffb703;
            padding-left: 10px;
        }

        .section-title {
            font-size: 20px;
            font-weight: 700;
        }

        .view-all {
            color: #ffb703;
            text-decoration: none;
            font-size: 14px;
        }

        /* Responsive Movie Grid */
        .movie-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        /* Accurate Card Design matching agasobanuyenow.com */
        .movie-card {
            background-color: #1a1a1a;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid #262626;
            transition: transform 0.2s, border-color 0.2s;
            position: relative;
        }

        .movie-card:hover {
            transform: translateY(-5px);
            border-color: #ffb703;
        }

        .poster-area {
            width: 100%;
            height: 240px;
            background-color: #2a2a2a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 14px;
            position: relative;
            font-weight: bold;
            text-align: center;
            padding: 10px;
        }

        /* Status tags like UPDATED or EPISODE codes */
        .status-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background-color: #ffb703;
            color: #000;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }

        .movie-info {
            padding: 12px;
        }

        .movie-tags {
            display: flex;
            gap: 5px;
            font-size: 11px;
            color: #888;
            margin-bottom: 5px;
        }

        .movie-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* The Voice Actor / Interpreter row */
        .interpreter-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #262626;
            padding-top: 8px;
            font-size: 12px;
        }

        .interpreter-name {
            color: #ffb703;
            font-weight: 500;
        }

        .watch-label {
            font-size: 11px;
            color: #aaa;
        }

        /* Video Player Popup Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal-content {
            background-color: #000;
            width: 95%;
            max-width: 850px;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            border: 1px solid #333;
        }

        .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            color: #fff;
            cursor: pointer;
            background: none;
            border: none;
            z-index: 2100;
        }

        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
        }

        .video-wrapper video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        /* Hamburger Navigation */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 4px;
            cursor: pointer;
            background: none;
            border: none;
        }

        .hamburger span {
            width: 22px;
            height: 2px;
            background-color: white;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .hamburger { display: flex; }
            nav {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 59px;
                left: 0;
                width: 100%;
                background-color: #0b0b0b;
                padding: 20px;
                border-bottom: 1px solid #222;
            }
            nav.open { display: flex; }
            .search-bar { width: 100%; }
            .whatsapp-banner { flex-direction: column; gap: 10px; text-align: center; }
        }
    </style>
</head>
<body>

    <header>
        <div class="logo-container">
            <a href="#" class="logo">Agasobanuye<span>Now</span></a>
        </div>
        
        <button class="hamburger" id="menuToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <nav id="navbar">
            <a href="#" class="active">Home</a>
            <a href="#">Movies</a>
            <a href="#">TV Shows</a>
            <a href="#">Interpreters</a>
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="Search...">
            </div>
        </nav>
    </header>

    <div class="whatsapp-banner">
        <div>Kora follow kuri Channel yacu ya WhatsApp ujye ubona updates n'amafilime mashya kugihe!</div>
        <a href="#" class="whatsapp-btn">Dukurikire kuri WhatsApp</a>
    </div>

    <main>
        <div class="section-header">
            <div class="section-title">🔥 Trending Today</div>
            <a href="#" class="view-all">View All</a>
        </div>

        <div class="movie-grid">
            <div class="movie-card" onclick="playMovie('Seven Snipers')">
                <div class="status-badge">New</div>
                <div class="poster-area">🎬<br>Seven Snipers</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Action</span>•<span>2026</span></div>
                    <div class="movie-title">Seven Snipers</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Sikov</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('Nemesis')">
                <div class="status-badge">S1EP2</div>
                <div class="poster-area">🎬<br>Nemesis</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Drama</span>•<span>2026</span></div>
                    <div class="movie-title">Nemesis</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Perfect</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('Revenger')">
                <div class="poster-area">🎬<br>Revenger</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Martial Arts</span>•<span>2018</span></div>
                    <div class="movie-title">Revenger</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Junior Giti</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('My Royal Nemesis')">
                <div class="status-badge">S1EP20</div>
                <div class="poster-area">🎬<br>My Royal Nemesis</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Romance</span>•<span>2026</span></div>
                    <div class="movie-title">My Royal Nemesis</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Perfect</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-header">
            <div class="section-title">Recently Added Movies</div>
            <a href="#" class="view-all">View All</a>
        </div>

        <div class="movie-grid">
            <div class="movie-card" onclick="playMovie('Fuze')">
                <div class="poster-area">🎬<br>Fuze</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Action</span>•<span>2026</span></div>
                    <div class="movie-title">Fuze</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Sankara</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('Race 3')">
                <div class="poster-area">🎬<br>Race 3</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Action</span>•<span>2018</span></div>
                    <div class="movie-title">Race 3</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Savimbi</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('Lawless Lawyer')">
                <div class="status-badge">UPDATED</div>
                <div class="poster-area">🎬<br>Lawless Lawyer</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Crime</span>•<span>2018</span></div>
                    <div class="movie-title">Lawless Lawyer</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Rocky</span>
                    </div>
                </div>
            </div>

            <div class="movie-card" onclick="playMovie('Beast')">
                <div class="poster-area">🎬<br>Beast</div>
                <div class="movie-info">
                    <div class="movie-tags"><span>Thriller</span>•<span>2022</span></div>
                    <div class="movie-title">Beast</div>
                    <div class="interpreter-row">
                        <span class="watch-label">Soberano:</span>
                        <span class="interpreter-name">Gaheza</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div class="modal-overlay" id="videoModal" onclick="closeMovie()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeMovie()">&times;</button>
            <div class="video-wrapper">
                <video id="player" controls>
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
                </video>
            </div>
        </div>
    </div>

    <script>
        // Hamburger Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navbar = document.getElementById('navbar');
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('open');
        });

        // Modal Video Player Controls
        const videoModal = document.getElementById('videoModal');
        const player = document.getElementById('player');

        function playMovie(title) {
            videoModal.style.display = 'flex';
            player.play();
        }

        function closeMovie() {
            videoModal.style.display = 'none';
            player.pause();
            player.currentTime = 0;
        }
    </script>
</body>
</html>
