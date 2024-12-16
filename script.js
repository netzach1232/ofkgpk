// ממתינים לטעינת ה-DOM במלואו
document.addEventListener("DOMContentLoaded", function () {
    // בוחרים את הודעת הברכה
    const welcomeMessage = document.getElementById("welcomeMessage");
    const welcomeMessageInstructions = document.getElementById("welcomeMessageInstructions");

    // מוסיפים אירוע לחיצה לכל העמוד
    document.addEventListener("click", function () {
        // מוסיפים את מחלקת ההתנדפות
        if (welcomeMessage) welcomeMessage.classList.add("fade-out");
        if (welcomeMessageInstructions) welcomeMessageInstructions.classList.add("fade-out");

        // מסירים את האלמנט לחלוטין מה-DOM אחרי שהתנדף (1 שנייה)
        setTimeout(() => {
            if (welcomeMessage) welcomeMessage.style.display = "none";
            if (welcomeMessageInstructions) welcomeMessageInstructions.style.display = "none";
        }, 1000); // משך ההתנדפות (1 שנייה)
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("uploadImages");
    const fileInput = document.getElementById("fileInput");
    const imageContainer = document.getElementById("imageContainer");

    // מחיקת תמונות קיימות מראש
    const predefinedImages = imageContainer.querySelectorAll("img");
    predefinedImages.forEach(img => img.remove());

    // פותח את חלון העלאת הקבצים
    uploadButton.addEventListener("click", () => {
        fileInput.click();
    });

    // טיפול בקבצים שנבחרו
    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;

        // עבור על הקבצים והוסף תמונות חדשות
        Array.from(files).forEach((file) => {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.onload = () => URL.revokeObjectURL(img.src); // שחרור זיכרון
            imageContainer.appendChild(img); // הוסף לדף
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadPdfButton = document.getElementById("uploadPdf");
    const pdfInput = document.getElementById("pdfInput");
    const imageContainer = document.getElementById("imageContainer");

    // פותח את חלון העלאת הקבצים
    uploadPdfButton.addEventListener("click", () => {
        pdfInput.click();
    });

    // טיפול בקובץ PDF שנבחר
    pdfInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            const fileReader = new FileReader();

            fileReader.onload = async function () {
                const pdfData = new Uint8Array(this.result);

                // טעינת קובץ PDF
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

                // נקה את הקונטיינר לתמונות
                imageContainer.innerHTML = "";

                // מעבר על כל דפי ה-PDF
                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    const page = await pdf.getPage(pageNumber);
                    const viewport = page.getViewport({ scale: 1.5 });

                    // יצירת קנבס חדש עבור כל דף
                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext("2d");

                    // ציור הדף בקנבס
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    await page.render(renderContext);

                    // הוספת הקנבס לקונטיינר
                    imageContainer.appendChild(canvas);
                }
            };

            fileReader.readAsArrayBuffer(file);
        } else {
            alert("נא לבחור קובץ PDF בלבד.");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("deleteImages");
    const imageContainer = document.getElementById("imageContainer");

    // מאזין ללחיצה על כפתור מחיקת כל ה-PDF
    deleteButton.addEventListener("click", () => {
        imageContainer.innerHTML = ""; // מנקה את כל הדפים של ה-PDF מהקונטיינר
    });
});


let scrollEnabled = true; // מצב גלילה
let scrollInterval;

// פונקציה להתחלת הגלילה
function startScroll(speed) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
    }, 4200 / speed);
}

// פונקציה לעצירת הגלילה
function stopScroll() {
    clearInterval(scrollInterval);
}

// פונקציה לבדיקה אם אלמנט פעיל
function isInteractiveElement(target) {
    return ['INPUT', 'BUTTON', 'TEXTAREA', 'A'].includes(target.tagName);
}

// הפעלת גלילה כשנקבע ערך למהירות
document.querySelector('.circle-input').addEventListener('input', function () {
    const speed = parseInt(this.value, 10) || 0;
    if (speed > 0) {
        scrollEnabled = true; // גלילה מופעלת
        startScroll(speed); // הפעלת הגלילה מידית
    } else {
        stopScroll(); // עצירת גלילה אם הערך 0
    }
});

// עצירת/חידוש גלילה בעת לחיצה על הדף
document.body.addEventListener('click', function (event) {
    if (isInteractiveElement(event.target)) {
        return; // אלמנטים פעילים לא מפעילים גלילה
    }
    scrollEnabled = !scrollEnabled;
    if (scrollEnabled) {
        const speed = parseInt(document.querySelector('.circle-input').value, 10) || 0;
        if (speed > 0) startScroll(speed);
    } else {
        stopScroll();
    }
});

// עצירת גלילה בעת לחיצה על אלמנטים מסוימים
document.querySelectorAll('img, button, a, input').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

