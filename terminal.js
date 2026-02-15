(() => {
    "use strict";

    const MAX_INPUT = 40;
    const terminal = document.getElementById("terminal");
    const history = document.getElementById("history");
    const inputView = document.getElementById("input-view");
    const cwdView = document.getElementById("cwd");
    const keycapture = document.getElementById("keycapture");
    const statusLine = document.getElementById("status-line");
    const postContent = document.getElementById("post-content");
    const themeToggle = document.getElementById("theme-toggle");
    const themeTransition = document.getElementById("theme-transition");

    const THEME_STORAGE_KEY = "blog-theme";

    const KEYWORDS = new Set(["whoami", "help", "clear", "ls", "cd", "cat"]);
    const DIRECTORIES = Object.freeze(["posts"]);
    const FALLBACK_POSTS = Object.freeze([
        { file: "hello-terminal.md", title: "Hello Terminal" },
        { file: "writing-in-markdown.md", title: "Writing in Markdown" }
    ]);
    const FALLBACK_POST_CONTENT = Object.freeze({
        "hello-terminal.md": "# Hello Terminal\n\nWelcome to the **posts** directory.\n\n- This is a sample post.\n- It is written in Markdown.\n\n> Tip: use `cd ..` to go back.\n",
        "writing-in-markdown.md": "# Writing in Markdown\n\nMarkdown lets you write using simple symbols:\n\n1. Headings with `#`.\n2. Lists with `-` or `1.`.\n3. **Bold** and *italic* text.\n4. Inline `code` and code blocks.\n\n```js\nconsole.log(\"Markdown inside the terminal!\");\n```\n\n[Learn more](https://www.markdownguide.org/).\n"
    });
    let postsList = [...FALLBACK_POSTS];

    const COMMANDS = Object.freeze({
        whoami: () => [{ text: "matheus", markdown: false }],
        help: () => [{ text: "Available commands: whoami, help, clear, ls, cd, cat", markdown: false }],
        ls: (args = "") => {
            const target = args.trim();
            if (!target && isInPostsDir()) {
                return [{ text: postsList.length ? postsList.map((post) => post.file).join("  ") : "(no posts)", markdown: false }];
            }
            if (!target) {
                return [{ text: DIRECTORIES.length ? DIRECTORIES.join("  ") : "(empty)", markdown: false }];
            }
            if (target === "posts" || target === "posts/") {
                if (!postsList.length) {
                    return [{ text: "(no posts)", markdown: false }];
                }
                return [{ text: postsList.map((post) => post.file).join("  "), markdown: false }];
            }
            if (target === ".." || target === "../") {
                return [{ text: DIRECTORIES.length ? DIRECTORIES.join("  ") : "(empty)", markdown: false }];
            }
            return [{ text: `no such directory: ${target}`, markdown: false }];
        },
        cd: (args = "") => {
            const target = args.trim();
            if (!target) {
                return [{ text: "no directory specified", markdown: false }];
            }
            if (target === "posts" || target === "posts/") {
                if (!isInPostsDir()) {
                    window.location.href = `${getSiteRootPath()}posts/`;
                    return [{ text: "redirecting to posts/index", markdown: false }];
                }
                return [{ text: "already in posts", markdown: false }];
            }
            if (target === ".." || target === "../") {
                if (isInPostsDir()) {
                    window.location.href = `${getSiteRootPath()}index.html`;
                    return [{ text: "redirecting to index", markdown: false }];
                }
                return [{ text: "already at root", markdown: false }];
            }
            const postTarget = resolvePostFile(target);
            if (postTarget) {
                if (isInPostsDir()) {
                    window.location.hash = encodeURIComponent(postTarget);
                    return [{ text: "opening post: " + postTarget, markdown: false }];
                }
                window.location.href = `posts/index.html#${encodeURIComponent(postTarget)}`;
                return [{ text: "redirecting to post: " + postTarget, markdown: false }];
            }
            return [{ text: `no such directory: ${target}`, markdown: false }];
        },
        cat: async (args = "") => {
            const target = resolvePostFile(args);
            if (!target) {
                return [{ text: `no such file: ${args.trim() || "(empty)"}`, markdown: false }];
            }

            return openPostFile(target, { updateRoute: true });
        },
        clear: () => {
            history.textContent = "";
            clearPostContent();
            setPostMode(false);
            clearPostRoute();
            triggerScrollHint();
            return [];
        }
    });

    let currentInput = "";
    const commandHistory = [];
    let historyIndex = -1;

    function focusCapture() {
        keycapture.focus({ preventScroll: true });
    }

    function setStatus(message = "", type = "") {
        if (!statusLine) {
            return;
        }
        statusLine.textContent = message;
        statusLine.classList.toggle("error", type === "error");
    }

    function getCurrentTheme() {
        return document.body.classList.contains("theme-dark") ? "dark" : "light";
    }

    function applyTheme(theme) {
        const dark = theme === "dark";
        document.body.classList.toggle("theme-dark", dark);
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
        }
    }

    function pickRevealColor(theme) {
        return theme === "dark" ? "#2d353b" : "#fdf6e3";
    }

    function toggleThemeWithReveal() {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";

        if (!themeTransition || !themeToggle) {
            applyTheme(nextTheme);
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            return;
        }

        const buttonRect = themeToggle.getBoundingClientRect();
        const cx = buttonRect.left + buttonRect.width / 2;
        const cy = buttonRect.top + buttonRect.height / 2;
        const maxX = Math.max(cx, window.innerWidth - cx);
        const maxY = Math.max(cy, window.innerHeight - cy);
        const radius = Math.hypot(maxX, maxY);

        themeTransition.style.setProperty("--reveal-x", `${cx}px`);
        themeTransition.style.setProperty("--reveal-y", `${cy}px`);
        themeTransition.style.setProperty("--reveal-radius", `${radius}px`);
        themeTransition.style.backgroundColor = pickRevealColor(nextTheme);
        themeTransition.classList.remove("active");
        void themeTransition.offsetWidth;
        themeTransition.classList.add("active");

        window.setTimeout(() => {
            applyTheme(nextTheme);
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        }, 280);

        window.setTimeout(() => {
            themeTransition.classList.remove("active");
        }, 560);
    }

    function initThemeToggle() {
        let theme = "light";
        try {
            const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
            if (stored === "light" || stored === "dark") {
                theme = stored;
            }
        } catch (_) {
            // ignore storage access errors
        }

        applyTheme(theme);

        if (themeToggle) {
            themeToggle.addEventListener("click", (event) => {
                event.preventDefault();
                toggleThemeWithReveal();
                focusCapture();
            });
        }
    }

    function renderCwd() {
        if (!cwdView) {
            return;
        }
        cwdView.textContent = isInPostsDir() ? "~/posts " : "";
    }

    function createCommandLine(text) {
        const line = document.createElement("div");
        line.className = "line";

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "λ ";
        line.appendChild(prompt);

        const normalized = text;
        const firstSpace = normalized.indexOf(" ");
        const command = firstSpace === -1 ? normalized : normalized.slice(0, firstSpace);
        const rest = firstSpace === -1 ? "" : normalized.slice(firstSpace);

        if (KEYWORDS.has(command)) {
            const cmdSpan = document.createElement("span");
            cmdSpan.className = "keyword";
            cmdSpan.textContent = command;
            line.appendChild(cmdSpan);
            if (rest) {
                line.appendChild(document.createTextNode(rest));
            }
        } else {
            line.appendChild(document.createTextNode(normalized));
        }

        return line;
    }

    function appendOutput(text, { markdown = true } = {}) {
        const out = document.createElement("div");
        out.className = "line";

        if (markdown) {
            out.classList.add("markdown");
            if (window.MarkdownRenderer && typeof window.MarkdownRenderer.renderInto === "function") {
                window.MarkdownRenderer.renderInto(out, text);
            } else {
                out.textContent = text;
            }
        } else {
            out.textContent = text;
        }

        history.appendChild(out);
    }

    function setPostMode(enabled) {
        document.body.classList.toggle("reading-post", Boolean(enabled));
    }

    function clearPostContent() {
        if (!postContent) {
            return;
        }
        postContent.textContent = "";
    }

    function renderPostContent(text) {
        if (!postContent) {
            appendOutput(text, { markdown: true });
            return;
        }

        postContent.textContent = "";
        postContent.classList.add("line", "markdown");
        if (window.MarkdownRenderer && typeof window.MarkdownRenderer.renderInto === "function") {
            window.MarkdownRenderer.renderInto(postContent, text);
        } else {
            postContent.textContent = text;
        }
    }

    function isInPostsDir() {
        return /\/posts(?:\/|$)/.test(window.location.pathname);
    }

    function getSiteRootPath() {
        const pathname = window.location.pathname;
        const marker = pathname.indexOf("/posts/");
        if (marker !== -1) {
            return `${pathname.slice(0, marker) || ""}/`;
        }
        const lastSlash = pathname.lastIndexOf("/");
        return lastSlash === -1 ? "/" : pathname.slice(0, lastSlash + 1);
    }

    function getPostsBasePath() {
        const pathname = window.location.pathname;
        const match = pathname.match(/^(.*\/posts\/)/);
        if (match) {
            return match[1];
        }
        return `${getSiteRootPath()}posts/`;
    }

    function fileToSlug(file) {
        return file.replace(/\.md$/i, "");
    }

    function resolvePostFromSlug(slug) {
        const normalized = slug.trim().replace(/\.md$/i, "");
        if (!normalized) {
            return "";
        }
        const match = postsList.find((post) => fileToSlug(post.file) === normalized);
        return match ? match.file : "";
    }

    function resolvePostFile(target) {
        const trimmed = target.trim();
        if (!trimmed) {
            return "";
        }
        const normalized = trimmed.endsWith(".md") ? trimmed : `${trimmed}.md`;
        const match = postsList.find((post) => post.file === normalized);
        return match ? match.file : "";
    }

    function resolvePostsManifestUrl() {
        if (isInPostsDir()) {
            return `${getPostsBasePath()}posts.json`;
        }
        return `${getSiteRootPath()}posts/posts.json`;
    }

    function resolvePostFileUrl(file) {
        if (isInPostsDir()) {
            return `${getPostsBasePath()}${file}`;
        }
        return `${getSiteRootPath()}posts/${file}`;
    }

    async function openPostFile(file, { updateRoute = false } = {}) {
        const fileUrl = resolvePostFileUrl(file);
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error("missing");
            }
            const content = await response.text();
            history.textContent = "";
            renderPostContent(content);
            setPostMode(true);
            if (updateRoute) {
                updatePostRoute(file);
            }
            return [];
        } catch (_) {
            const fallbackContent = FALLBACK_POST_CONTENT[file];
            if (fallbackContent) {
                history.textContent = "";
                renderPostContent(fallbackContent);
                setPostMode(true);
                if (updateRoute) {
                    updatePostRoute(file);
                }
                return [];
            }
            return [{ text: `failed to read file: ${file}`, markdown: false }];
        }
    }

    function updatePostRoute(file) {
        const encodedFile = encodeURIComponent(file);
        if (isInPostsDir()) {
            const slug = fileToSlug(file);
            if (slug) {
                window.history.replaceState(null, "", `${getPostsBasePath()}${encodeURIComponent(slug)}/`);
            } else {
                window.history.replaceState(null, "", `${getPostsBasePath()}index.html#${encodedFile}`);
            }
            return;
        }
        const basePath = window.location.pathname;
        window.history.replaceState(null, "", `${basePath}#${encodeURIComponent(`posts/${file}`)}`);
    }

    function clearPostRoute() {
        if (isInPostsDir()) {
            window.history.replaceState(null, "", `${getPostsBasePath()}index.html`);
            return;
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    function resolveInitialPostFromUrl() {
        const rawHash = window.location.hash.replace(/^#/, "");
        if (rawHash) {
            const decodedHash = decodeURIComponent(rawHash);
            const hashCandidate = decodedHash.startsWith("posts/") ? decodedHash.slice(6) : decodedHash;
            const hashFile = resolvePostFile(hashCandidate);
            if (hashFile) {
                return hashFile;
            }
        }

        if (isInPostsDir()) {
            const pathname = window.location.pathname;
            const parts = pathname.split("/").filter(Boolean);
            const postsIndex = parts.indexOf("posts");
            if (postsIndex !== -1 && postsIndex + 1 < parts.length) {
                const slug = decodeURIComponent(parts[postsIndex + 1]);
                if (slug && slug !== "index.html") {
                    const pathFile = resolvePostFromSlug(slug) || resolvePostFile(slug);
                    if (pathFile) {
                        return pathFile;
                    }
                }
            }
        }

        return "";
    }

    function loadPostsManifest() {
        const manifestUrl = resolvePostsManifestUrl();
        return fetch(manifestUrl)
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error("missing"))))
            .then((data) => {
                if (!Array.isArray(data)) {
                    return;
                }
                postsList = data
                    .filter((post) => post && typeof post.file === "string")
                    .map((post) => ({
                        file: post.file,
                        title: typeof post.title === "string" ? post.title : post.file
                    }));
            })
            .catch(() => {
                postsList = [...FALLBACK_POSTS];
            });
    }

    function isNearBottom(el) {
        return el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
    }

    function scrollToBottom() {
        history.scrollTop = history.scrollHeight;
    }

    function triggerScrollHint() {
        history.classList.remove("scroll-hint");
        void history.offsetWidth;
        history.classList.add("scroll-hint");
        window.setTimeout(() => {
            history.classList.remove("scroll-hint");
        }, 1850);
    }

    function renderCurrentInput() {
        const normalized = currentInput;
        inputView.textContent = "";

        const firstSpace = normalized.indexOf(" ");
        const command = firstSpace === -1 ? normalized : normalized.slice(0, firstSpace);
        const rest = firstSpace === -1 ? "" : normalized.slice(firstSpace);

        if (KEYWORDS.has(command)) {
            const cmdSpan = document.createElement("span");
            cmdSpan.className = "keyword";
            cmdSpan.textContent = command;
            inputView.appendChild(cmdSpan);
            if (rest) {
                inputView.appendChild(document.createTextNode(rest));
            }
        } else {
            inputView.textContent = normalized;
        }
    }

    async function parseAndRun(rawInput) {
        const input = rawInput.trim();
        if (!input) {
            return;
        }

        const wasAtBottom = isNearBottom(history);

        if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== input) {
            commandHistory.push(input);
        }
        historyIndex = commandHistory.length;

        history.appendChild(createCommandLine(input));

        const space = input.indexOf(" ");
        const command = (space === -1 ? input : input.slice(0, space)).toLowerCase();

        // Secure parsing: strict allowlist command dispatch, no eval, no shell execution.
        const action = COMMANDS[command];
        if (!action) {
            if (command !== "cat") {
                setPostMode(false);
                clearPostContent();
            }
            appendOutput("command not found: " + command, { markdown: false });
            setStatus(`command not found: ${command}`, "error");
            return;
        }

        const args = space === -1 ? "" : input.slice(space + 1);
        if (command !== "cat" && command !== "clear") {
            setPostMode(false);
            clearPostContent();
            clearPostRoute();
        }
        const outLines = await action(args);
        const firstText = outLines.length ? outLines[0].text : "";
        if (outLines.length && /^(no |no such|\(no |failed )/i.test(firstText)) {
            setStatus(firstText, "error");
        } else {
            setStatus("", "");
        }
        for (let i = 0; i < outLines.length; i += 1) {
            appendOutput(outLines[i].text, { markdown: outLines[i].markdown !== false });
        }

        if (wasAtBottom) {
            scrollToBottom();
        }

        if (history.scrollHeight > history.clientHeight) {
            triggerScrollHint();
        }
    }

    function splitInputForCompletion(raw) {
        const hasTrailingSpace = /\s$/.test(raw);
        const trimmedLeft = raw.replace(/^\s+/, "");
        const firstSpace = trimmedLeft.indexOf(" ");

        if (firstSpace === -1) {
            return {
                commandPart: trimmedLeft,
                argPart: "",
                isCommand: !hasTrailingSpace
            };
        }

        const commandPart = trimmedLeft.slice(0, firstSpace);
        const argPart = trimmedLeft.slice(firstSpace + 1);
        return {
            commandPart,
            argPart,
            isCommand: false
        };
    }

    function uniqueMatches(prefix, values) {
        if (!prefix) {
            return [...values];
        }
        return values.filter((value) => value.startsWith(prefix));
    }

    function completeWithMatches(prefix, matches, baseInput) {
        if (!matches.length) {
            return false;
        }

        if (matches.length === 1) {
            currentInput = `${baseInput}${matches[0]} `.slice(0, MAX_INPUT);
            renderCurrentInput();
            return true;
        }

        appendOutput(matches.join("  "), { markdown: false });
        scrollToBottom();
        triggerScrollHint();
        return true;
    }

    function handleTabCompletion() {
        const parsed = splitInputForCompletion(currentInput);
        const commands = Object.keys(COMMANDS);
        const fileNames = postsList.map((post) => post.file);

        if (parsed.isCommand) {
            const matches = uniqueMatches(parsed.commandPart, commands);
            return completeWithMatches(parsed.commandPart, matches, "");
        }

        const command = parsed.commandPart.toLowerCase();
        const argPrefix = parsed.argPart.trim();

        if (command === "cat") {
            const matches = uniqueMatches(argPrefix, fileNames);
            return completeWithMatches(argPrefix, matches, "cat ");
        }

        if (command === "cd") {
            const candidates = isInPostsDir() ? ["..", ...fileNames] : ["posts", ...fileNames];
            const matches = uniqueMatches(argPrefix, candidates);
            return completeWithMatches(argPrefix, matches, "cd ");
        }

        if (command === "ls") {
            const candidates = isInPostsDir() ? ["..", ...fileNames] : ["posts"];
            const matches = uniqueMatches(argPrefix, candidates);
            return completeWithMatches(argPrefix, matches, "ls ");
        }

        return false;
    }

    terminal.addEventListener("pointerdown", focusCapture, { passive: true });
    document.addEventListener("pointerdown", () => {
        focusCapture();
    }, { passive: true });

    function handleKeydown(event) {
        if (event.ctrlKey && !event.metaKey && !event.altKey) {
            const lowered = event.key.toLowerCase();
            if (lowered === "l") {
                COMMANDS.clear();
                event.preventDefault();
                return;
            }
            if (lowered === "k") {
                focusCapture();
                event.preventDefault();
                return;
            }
        }

        if (event.key === "Enter") {
            parseAndRun(currentInput);
            currentInput = "";
            renderCurrentInput();
            event.preventDefault();
            return;
        }

        if (event.key === "Tab") {
            handleTabCompletion();
            event.preventDefault();
            return;
        }

        if (event.key === "Backspace") {
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                renderCurrentInput();
            }
            event.preventDefault();
            return;
        }

        if (event.key === "ArrowUp") {
            if (commandHistory.length > 0) {
                historyIndex = Math.max(0, historyIndex - 1);
                currentInput = commandHistory[historyIndex] || "";
                renderCurrentInput();
            }
            event.preventDefault();
            return;
        }

        if (event.key === "ArrowDown") {
            if (commandHistory.length > 0) {
                historyIndex = Math.min(commandHistory.length, historyIndex + 1);
                currentInput = historyIndex === commandHistory.length ? "" : (commandHistory[historyIndex] || "");
                renderCurrentInput();
            }
            event.preventDefault();
            return;
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            if (currentInput.length < MAX_INPUT) {
                currentInput += event.key;
                renderCurrentInput();
            }
            event.preventDefault();
        }
    }

    keycapture.addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", (event) => {
        if (event.target instanceof Element && event.target.closest("#theme-toggle")) {
            return;
        }
        if (event.target === keycapture) {
            return;
        }
        focusCapture();
        handleKeydown(event);
    });

    window.addEventListener("blur", () => {
        keycapture.value = "";
    });

    window.addEventListener("focus", () => {
        focusCapture();
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            focusCapture();
        }
    });

    window.addEventListener("hashchange", () => {
        const routePost = resolveInitialPostFromUrl();
        if (routePost) {
            void openPostFile(routePost, { updateRoute: false });
            return;
        }
        setPostMode(false);
        clearPostContent();
    });

    history.addEventListener("scroll", () => {
        if (isNearBottom(history)) {
            history.classList.remove("scroll-hint");
        }
    }, { passive: true });

    loadPostsManifest().finally(() => {
        const initialPost = resolveInitialPostFromUrl();
        if (initialPost) {
            void openPostFile(initialPost, { updateRoute: true });
        }
    });
    initThemeToggle();
    renderCwd();
    focusCapture();
    renderCurrentInput();
})();
