// Создаем меню и добавляем его на страницу
function createMenu() {
    const menuBar = document.createElement('div');
    menuBar.className = 'menu-bar';
    
    const menuItems = [
        { href: 'profile.html', icon: '👤' },
        { href: 'leaders.html', icon: '🏆' },
        { href: 'index.html', icon: '🎮' },
        { href: 'shop.html', icon: '🛍️' },
        { href: 'community.html', icon: '👥' }
    ];
    
    menuItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'menu-item';
        link.innerHTML = item.icon;
        menuBar.appendChild(link);
    });
    
    document.body.appendChild(menuBar);
}

// Вызываем создание меню при загрузке страницы
document.addEventListener('DOMContentLoaded', createMenu);
