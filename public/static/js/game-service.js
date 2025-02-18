class GameService {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUser = null;
    }

    async initializeUser(telegramData) {
        // Создаем или обновляем пользователя при входе через Telegram
        const userRef = this.db.collection('users').doc(telegramData.id.toString());
        
        const userData = {
            telegramId: telegramData.id,
            username: telegramData.username,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            lives: 20, // Начальное количество жизней
            stars: 0,
            totalGames: 0,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };

        await userRef.set(userData, { merge: true });
        this.currentUser = userData;
    }

    async updateScore(score) {
        if (!this.currentUser) return;

        const userRef = this.db.collection('users').doc(this.currentUser.telegramId.toString());
        
        // Обновляем статистику пользователя
        await userRef.update({
            highScore: firebase.firestore.FieldValue.arrayUnion(score),
            totalGames: firebase.firestore.FieldValue.increment(1),
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Добавляем счет в таблицу лидеров
        await this.db.collection('leaderboard').add({
            userId: this.currentUser.telegramId,
            username: this.currentUser.username,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async getLives() {
        if (!this.currentUser) return 20;

        const userDoc = await this.db.collection('users')
            .doc(this.currentUser.telegramId.toString())
            .get();
        
        return userDoc.data().lives || 20;
    }

    async addLives(amount) {
        if (!this.currentUser) return;

        const userRef = this.db.collection('users').doc(this.currentUser.telegramId.toString());
        await userRef.update({
            lives: firebase.firestore.FieldValue.increment(amount)
        });
    }

    async getLeaderboard() {
        const snapshot = await this.db.collection('leaderboard')
            .orderBy('score', 'desc')
            .limit(10)
            .get();

        return snapshot.docs.map(doc => doc.data());
    }

    async addReferral(referrerId) {
        if (!this.currentUser) return;

        const referrerRef = this.db.collection('users').doc(referrerId.toString());
        
        // Добавляем реферала и награждаем реферера
        await referrerRef.update({
            referrals: firebase.firestore.FieldValue.arrayUnion(this.currentUser.telegramId),
            stars: firebase.firestore.FieldValue.increment(10) // Награда за реферала
        });
    }

    async getStats() {
        if (!this.currentUser) return null;

        const userDoc = await this.db.collection('users')
            .doc(this.currentUser.telegramId.toString())
            .get();
        
        return userDoc.data();
    }
}
