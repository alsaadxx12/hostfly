// الحصول على عنصر منطقة المحتوى الديناميكي
const contentArea = document.getElementById('content-area');

// وظيفة لإنشاء الأزرار الأولية
function showInitialButtons() {
    contentArea.innerHTML = `
        <div id="initial-buttons">
            <button id="subscription-btn" class="option-btn"><i class="fas fa-user-lock"></i> استخدام اشتراك</button>
            <button id="free-access-btn" class="option-btn"><i class="fas fa-clock"></i> نصف ساعة مجاناً</button>
        </div>
    `;

    // إضافة مستمعي الأحداث للأزرار
    document.getElementById('subscription-btn').addEventListener('click', showLoginForm);
    document.getElementById('free-access-btn').addEventListener('click', startFreeAccess);
}

// وظيفة لإظهار نموذج تسجيل الدخول
function showLoginForm() {
    contentArea.innerHTML = `
        <div id="login-form">
            <form action="submit-login.php" method="POST">
                <div class="input-box">
                    <label for="username">اسم المستخدم</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-box">
                    <label for="password">كلمة المرور</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <!-- زر دخول وزر عودة -->
                <button type="submit" class="login-btn"><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</button>
                <button type="button" id="back-btn" class="login-btn"><i class="fas fa-arrow-left"></i> عودة</button>
            </form>
        </div>
    `;

    // إضافة مستمع لزر العودة
    document.getElementById('back-btn').addEventListener('click', showInitialButtons);
}

// وظيفة لبدء الولوج المجاني
function startFreeAccess() {
    // تحديد وقت النهاية (بعد 30 دقيقة)
    const endTime = new Date().getTime() + 30 * 60 * 1000;
    localStorage.setItem('freeAccessEndTime', endTime);

    // عرض العد التنازلي
    showCountdown(endTime);
}

// وظيفة لعرض العد التنازلي
function showCountdown(endTime) {
    // إنشاء عنصر العد التنازلي
    contentArea.innerHTML = `
        <div class="countdown-timer" id="countdown">
            الوقت المتبقي: 30 دقيقة و 00 ثانية
        </div>
    `;

    const countdownElement = document.getElementById('countdown');

    // تحديث العد التنازلي كل ثانية
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        // حساب الوقت المتبقي
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // تحديث العد التنازلي في الـ DOM
        countdownElement.textContent = `الوقت المتبقي: ${minutes} دقيقة و ${seconds} ثانية`;

        // إذا انتهى الوقت
        if (distance < 0) {
            clearInterval(countdownInterval);
            localStorage.removeItem('freeAccessEndTime');
            showEndMessage();
        }
    }, 1000);
}

// وظيفة لعرض رسالة انتهاء الباقة
function showEndMessage() {
    contentArea.innerHTML = `
        <div class="message">
            انتهت باقة النصف ساعة المجانية. لا يمكنك استخدام الإنترنت.
        </div>
    `;
}

// التحقق من حالة الجلسة عند تحميل الصفحة
window.onload = function() {
    const storedEndTime = localStorage.getItem('freeAccessEndTime');
    if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const now = new Date().getTime();
        if (endTime > now) {
            // إذا كانت الباقة لا تزال سارية
            showCountdown(endTime);
        } else {
            // انتهت الباقة
            localStorage.removeItem('freeAccessEndTime');
            showEndMessage();
        }
    } else {
        // عرض الأزرار الأولية
        showInitialButtons();
    }
};
