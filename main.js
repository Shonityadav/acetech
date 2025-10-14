document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. COMPONENT LOADER
    // ==========================================================
    const loadComponent = (url, elementId) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component: ${url}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) element.innerHTML = data;
            })
            .catch(error => console.error(error));
    };

    // ==========================================================
    // 2. REUSABLE & PAGE-SPECIFIC INITIALIZATION FUNCTIONS
    // ==========================================================

    /**
     * Initializes a hero text slider with manual controls and auto-play.
     * @param {string[]} textOptions - An array of strings to display in the slider.
     */
    const initHeroSlider = (textOptions) => {
        const sliderTextElement = document.getElementById('hero-slider-text');
        const sliderWrapper = document.getElementById('hero-slider-text-wrapper');
        const prevButton = document.getElementById('hero-slider-prev');
        const nextButton = document.getElementById('hero-slider-next');

        if (sliderTextElement && sliderWrapper && prevButton && nextButton) {
            let textIndex = 0;
            let slideInterval;
            let isAnimating = false;

            const updateSliderText = (newIndex) => {
                if (isAnimating) return;
                isAnimating = true;
                textIndex = newIndex;

                sliderWrapper.classList.add('is-changing');
                sliderTextElement.classList.remove('slide-in');
                sliderTextElement.classList.add('slide-out');

                setTimeout(() => {
                    sliderTextElement.textContent = textOptions[textIndex];
                    sliderTextElement.classList.remove('slide-out');
                    sliderTextElement.classList.add('slide-next');
                    sliderWrapper.classList.remove('is-changing');
                    
                    void sliderTextElement.offsetWidth; // Force reflow
                    
                    requestAnimationFrame(() => {
                        sliderTextElement.classList.remove('slide-next');
                        sliderTextElement.classList.add('slide-in');
                        setTimeout(() => isAnimating = false, 400); // Animation duration
                    });
                }, 400); // Animation duration
            };
            
            sliderTextElement.classList.add('slide-in'); // Set initial state

            const startSlider = () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(() => updateSliderText((textIndex + 1) % textOptions.length), 5000); // Auto-slide every 5 seconds
            };

            const resetSlider = () => {
                clearInterval(slideInterval);
                startSlider();
            };

            nextButton.addEventListener('click', () => {
                updateSliderText((textIndex + 1) % textOptions.length);
                resetSlider();
            });

            prevButton.addEventListener('click', () => {
                updateSliderText((textIndex - 1 + textOptions.length) % textOptions.length);
                resetSlider();
            });

            startSlider();
        }
    };

    const initIndexPage = () => {
        // Init Hero Slider for Index Page
        initHeroSlider([
            "Discover a universe of stories, information, and inspiration.",
            "Your next great read is just a click away.",
            "Access teacher manuals, ebooks, and test generators.",
            "Join our community of learners and educators."
        ]);

        // Scroll-triggered card animations
        const animatedSections = document.querySelectorAll('#features, #new-arrivals');
        animatedSections.forEach(section => {
            const animatedCards = section.querySelectorAll('.animated-card');
            if (animatedCards.length > 0) {
                animatedCards.forEach(card => {
                    if (card.classList.contains('slide-left')) card.classList.add('off-left');
                    else if (card.classList.contains('slide-right')) card.classList.add('off-right');
                    else card.classList.add('off-up');
                });
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animatedCards.forEach((card, index) => {
                                setTimeout(() => card.classList.add('visible'), index * 150);
                            });
                        } else {
                            animatedCards.forEach(card => card.classList.remove('visible'));
                        }
                    });
                }, { threshold: 0.2 });
                observer.observe(section);
            }
        });

        // 3D Book carousel
        const books = document.querySelectorAll('#popular-books .book-item');
        if (books.length > 0) {
            const nextBtn = document.querySelector('#popular-books .next-arrow');
            const prevBtn = document.querySelector('#popular-books .prev-arrow');
            let currentIndex = 0;
            const updateCarousel = () => {
                books.forEach((book, index) => {
                    book.classList.remove('active', 'prev', 'next', 'prev2', 'next2', 'hidden-left', 'hidden-right');
                    let newIndex = index - currentIndex;
                    if (newIndex < -Math.floor(books.length / 2)) newIndex += books.length;
                    if (newIndex > Math.floor(books.length / 2)) newIndex -= books.length;
                    const classMap = { 0: 'active', '-1': 'prev', 1: 'next', '-2': 'prev2', 2: 'next2' };
                    const newClass = classMap[newIndex] || (newIndex < -2 ? 'hidden-left' : 'hidden-right');
                    book.classList.add(newClass);
                });
            };
            nextBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + books.length) % books.length; updateCarousel(); });
            prevBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % books.length; updateCarousel(); });
            updateCarousel();
            document.querySelector('#popular-books .book-carousel-container').classList.add('carousel-loaded');
        }
    };

    const initAboutPage = () => {
        initHeroSlider([
            "Learn about our journey, mission, and our dedicated team.",
            "Discover our passion for accessible digital education.",
            "Meet the people behind the pages.",
            "Join us in our mission to spread knowledge."
        ]);
    };

    const initEbooksPage = () => {
        initHeroSlider([
            "Browse our extensive collection of digital books.",
            "Find your next adventure on any device.",
            "Thousands of titles at your fingertips.",
            "From bestsellers to academic texts."
        ]);

        // Infinite scroll for ebooks
        const ebookContainer = document.getElementById('ebook-container');
        const loader = document.getElementById('loader');
        if (ebookContainer && loader) {
            let isLoading = false; let page = 1; const booksPerPage = 16;
            const allBooks = [ 
                { title: 'Don Quixote', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', link: '#' }, { title: 'A Tale of Two Cities', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794', link: '#' }, { title: 'The Lord of the Rings', image: 'https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif', link: '#' }, { title: 'The Little Prince', image: 'https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG', link: '#' }, { title: 'Harry Potter', image: 'https://upload.wikimedia.org/wikipedia/en/b/bf/Harry_Potter_and_the_Sorcerer%27s_Stone.jpg', link: '#' }, { title: 'And Then There Were None', image: 'https://upload.wikimedia.org/wikipedia/en/c/c8/AndThenThereWereNone.jpg', link: '#' }, { title: 'The Hobbit', image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg', link: '#' }, { title: 'The Lion, the Witch and the Wardrobe', image: 'https://upload.wikimedia.org/wikipedia/en/8/86/TheLionWitchWardrobe%281stEd%29.jpg', link: '#' }, { title: 'The Da Vinci Code', image: 'https://upload.wikimedia.org/wikipedia/en/6/6b/DaVinciCode.jpg', link: '#' }
            ];
            const createBookCard = (book) => `<div class="col-lg-3 col-md-4 col-sm-6 mb-4"><div class="card h-100 book-card"><img src="${book.image}" class="card-img-top" alt="${book.title}"><div class="card-body"><h5 class="card-title">${book.title}</h5></div><div class="card-footer"><a href="${book.link}" target="_blank" class="btn btn-primary">View Book</a></div></div></div>`;
            const loadBooks = () => {
                if (isLoading) return; isLoading = true; loader.style.display = 'block';
                setTimeout(() => {
                    const booksToLoad = allBooks.slice((page - 1) * booksPerPage, page * booksPerPage);
                    if (booksToLoad.length > 0) { booksToLoad.forEach(book => ebookContainer.innerHTML += createBookCard(book)); page++; }
                    loader.style.display = 'none'; isLoading = false;
                }, 1000);
            };
            loadBooks();
            window.addEventListener('scroll', () => {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
                    if (page > Math.ceil(allBooks.length / booksPerPage)) page = 1;
                    loadBooks();
                }
            });
        }
    };

    const initDownloadsPage = () => {
        initHeroSlider([
            "Download teacher manuals and answer keys.",
            "Access a wide range of educational materials.",
            "Supplementary resources for effective learning.",
            "All the tools you need in one place."
        ]);
        
        const accordionContainer = document.getElementById('downloadsAccordion');
        const searchInput = document.getElementById('searchInput');
        const noResultsDiv = document.getElementById('no-results');
        if (accordionContainer && searchInput) {
             const downloadsData = [
                { grade: 'Grade 8', title: 'Advanced Mathematics Manual', subject: 'Maths', url: '#' }, { grade: 'Grade 8', title: 'Physics Concepts Guide', subject: 'Science', url: '#' }, { grade: 'Grade 8', title: 'Modern World History Resources', subject: 'Social Studies', url: '#' }, { grade: 'Grade 7', title: 'Algebra Fundamentals', subject: 'Maths', url: '#' }, { grade: 'Grade 7', title: 'Biology Teacher Manual', subject: 'Science', url: '#' }, { grade: 'General', title: 'School Order Form 2025', subject: 'Admin', url: '#' }
            ];
            const renderDownloads = (filter = '') => {
                const searchTerm = filter.toLowerCase().trim();
                const groupedData = downloadsData.reduce((acc, item) => {
                    if (!acc[item.grade]) acc[item.grade] = [];
                    acc[item.grade].push(item); return acc;
                }, {});
                let html = ''; let totalResults = 0;
                for (const grade in groupedData) {
                    const filteredItems = groupedData[grade].filter(item => item.title.toLowerCase().includes(searchTerm) || item.subject.toLowerCase().includes(searchTerm));
                    if (filteredItems.length > 0) {
                        totalResults += filteredItems.length;
                        const gradeId = grade.replace(/\s+/g, '');
                        html += `<div class="accordion-item"><h2 class="accordion-header" id="heading${gradeId}"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${gradeId}" aria-expanded="true" aria-controls="collapse${gradeId}">${grade}</button></h2><div id="collapse${gradeId}" class="accordion-collapse collapse show" aria-labelledby="heading${gradeId}"><div class="accordion-body">`;
                        filteredItems.forEach(item => { html += `<div class="download-item"><div class="download-info"><p class="title">${item.title}</p><span class="subject-badge">${item.subject}</span></div><a href="${item.url}" class="btn btn-primary btn-sm" download><i class="bi bi-download me-1"></i> Download</a></div>`; });
                        html += `</div></div></div>`;
                    }
                }
                accordionContainer.innerHTML = html;
                noResultsDiv.style.display = totalResults === 0 ? 'block' : 'none';
                accordionContainer.style.display = totalResults === 0 ? 'none' : 'block';
            };
            renderDownloads();
            searchInput.addEventListener('input', (e) => renderDownloads(e.target.value));
        }
    };

    const initContactPage = () => {
        initHeroSlider([
            "We're here to help and answer any question you might have.",
            "Reach out to our support team 24/7.", "Have a question? Don't hesitate to ask.", "We love hearing from our readers!"
        ]);
    };
    
    // ==========================================================
    // 3. MAIN EXECUTION FLOW
    // ==========================================================
    Promise.all([
        loadComponent('navbar.html', 'navbar-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]).then(() => {
        const navbar = document.getElementById('main-navbar');
        if (navbar) {
            const pageId = document.body.id;
            if (pageId === 'page-contact' || pageId === 'page-downloads') {
                navbar.classList.add('scrolled');
            } else {
                window.addEventListener('scroll', () => {
                    navbar.classList.toggle('scrolled', window.scrollY > 50);
                });
            }
        }
        
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const currentPagePath = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPagePath) {
                link.parentElement.classList.add('active');
            }
        });

        const pageId = document.body.id;
        if (pageId === 'page-index') initIndexPage();
        else if (pageId === 'page-about') initAboutPage();
        else if (pageId === 'page-ebooks') initEbooksPage();
        else if (pageId === 'page-downloads') initDownloadsPage();
        else if (pageId === 'page-contact') initContactPage();

        document.querySelectorAll('.animate-on-load').forEach(el => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });

    }).catch(error => {
        console.error("Error loading components or initializing page:", error);
    });
});

