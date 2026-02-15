(() => {
    "use strict";

    function renderMarkdownInto(container, text) {
        const fragment = document.createDocumentFragment();
        const lines = text.replace(/\r\n/g, "\n").split("\n");
        let index = 0;

        while (index < lines.length) {
            const line = lines[index];

            if (line.startsWith("```")) {
                const language = normalizeCodeLanguage(line.slice(3).trim());
                const codeLines = [];
                index += 1;
                while (index < lines.length && !lines[index].startsWith("```")) {
                    codeLines.push(lines[index]);
                    index += 1;
                }
                index += 1;
                const pre = document.createElement("pre");
                const code = document.createElement("code");
                const source = codeLines.join("\n");
                if (language) {
                    code.dataset.lang = language;
                    code.classList.add(`language-${language}`);
                }

                if (window.hljs && typeof window.hljs.highlightElement === "function") {
                    code.textContent = source;
                    window.hljs.highlightElement(code);
                } else {
                    appendHighlightedCode(code, source, language);
                }
                pre.appendChild(code);
                fragment.appendChild(pre);
                continue;
            }

            if (!line.trim()) {
                const spacer = document.createElement("div");
                spacer.className = "md-spacer";
                fragment.appendChild(spacer);
                index += 1;
                continue;
            }

            const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const heading = document.createElement(`h${level}`);
                appendInlineNodes(heading, headingMatch[2]);
                fragment.appendChild(heading);
                index += 1;
                continue;
            }

            if (line.startsWith(">")) {
                const blockquote = document.createElement("blockquote");
                while (index < lines.length && lines[index].startsWith(">")) {
                    const textLine = lines[index].replace(/^>\s?/, "");
                    const p = document.createElement("p");
                    appendInlineNodes(p, textLine);
                    blockquote.appendChild(p);
                    index += 1;
                }
                fragment.appendChild(blockquote);
                continue;
            }

            if (line.match(/^[-*]\s+/)) {
                const list = document.createElement("ul");
                while (index < lines.length && lines[index].match(/^[-*]\s+/)) {
                    const itemText = lines[index].replace(/^[-*]\s+/, "");
                    const li = document.createElement("li");
                    appendInlineNodes(li, itemText);
                    list.appendChild(li);
                    index += 1;
                }
                fragment.appendChild(list);
                continue;
            }

            if (line.match(/^\d+\.\s+/)) {
                const list = document.createElement("ol");
                while (index < lines.length && lines[index].match(/^\d+\.\s+/)) {
                    const itemText = lines[index].replace(/^\d+\.\s+/, "");
                    const li = document.createElement("li");
                    appendInlineNodes(li, itemText);
                    list.appendChild(li);
                    index += 1;
                }
                fragment.appendChild(list);
                continue;
            }

            const paragraph = document.createElement("p");
            appendInlineNodes(paragraph, line);
            fragment.appendChild(paragraph);
            index += 1;
        }

        container.appendChild(fragment);
    }

    function appendInlineNodes(parent, text) {
        let cursor = 0;

        while (cursor < text.length) {
            const next = findNextInlineToken(text, cursor);
            if (!next) {
                parent.appendChild(document.createTextNode(text.slice(cursor)));
                break;
            }

            if (next.index > cursor) {
                parent.appendChild(document.createTextNode(text.slice(cursor, next.index)));
            }

            if (next.type === "code") {
                const end = text.indexOf("`", next.index + 1);
                if (end === -1) {
                    parent.appendChild(document.createTextNode(text.slice(next.index)));
                    break;
                }
                const code = document.createElement("code");
                code.textContent = text.slice(next.index + 1, end);
                parent.appendChild(code);
                cursor = end + 1;
                continue;
            }

            if (next.type === "bold") {
                const end = text.indexOf("**", next.index + 2);
                if (end === -1) {
                    parent.appendChild(document.createTextNode(text.slice(next.index)));
                    break;
                }
                const strong = document.createElement("strong");
                strong.textContent = text.slice(next.index + 2, end);
                parent.appendChild(strong);
                cursor = end + 2;
                continue;
            }

            if (next.type === "italic") {
                const end = text.indexOf("*", next.index + 1);
                if (end === -1) {
                    parent.appendChild(document.createTextNode(text.slice(next.index)));
                    break;
                }
                const em = document.createElement("em");
                em.textContent = text.slice(next.index + 1, end);
                parent.appendChild(em);
                cursor = end + 1;
                continue;
            }

            if (next.type === "link") {
                const link = parseLinkToken(text, next.index);
                if (!link) {
                    parent.appendChild(document.createTextNode(text.slice(next.index, next.index + 1)));
                    cursor = next.index + 1;
                    continue;
                }
                const anchor = document.createElement("a");
                anchor.href = link.href;
                anchor.target = "_blank";
                anchor.rel = "noreferrer";
                anchor.textContent = link.label;
                parent.appendChild(anchor);
                cursor = link.end;
                continue;
            }

            parent.appendChild(document.createTextNode(text.slice(next.index, next.index + 1)));
            cursor = next.index + 1;
        }
    }

    function findNextInlineToken(text, start) {
        const tokens = [
            { type: "bold", value: "**" },
            { type: "code", value: "`" },
            { type: "italic", value: "*" },
            { type: "link", value: "[" }
        ];

        let found = null;
        for (const token of tokens) {
            const index = text.indexOf(token.value, start);
            if (index === -1) {
                continue;
            }
            if (!found || index < found.index) {
                found = { type: token.type, index };
            }
        }

        return found;
    }

    function parseLinkToken(text, start) {
        if (text[start] !== "[") {
            return null;
        }
        const closingBracket = text.indexOf("]", start + 1);
        if (closingBracket === -1 || text[closingBracket + 1] !== "(") {
            return null;
        }
        const closingParen = text.indexOf(")", closingBracket + 2);
        if (closingParen === -1) {
            return null;
        }
        const label = text.slice(start + 1, closingBracket);
        const href = text.slice(closingBracket + 2, closingParen);
        return {
            label,
            href,
            end: closingParen + 1
        };
    }

    function normalizeCodeLanguage(raw) {
        const value = raw.toLowerCase();
        if (!value) {
            return "";
        }
        if (["js", "javascript", "ts", "typescript", "json"].includes(value)) {
            return "javascript";
        }
        if (["py", "python"].includes(value)) {
            return "python";
        }
        if (["sh", "bash", "zsh", "shell"].includes(value)) {
            return "bash";
        }
        return value;
    }

    function appendHighlightedCode(codeEl, source, language) {
        const lang = normalizeCodeLanguage(language || "");
        if (lang !== "javascript" && lang !== "python" && lang !== "bash") {
            codeEl.textContent = source;
            return;
        }

        const pattern = lang === "python"
            ? /(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|raise|with|lambda|pass|break|continue|True|False|None|and|or|not|is)\b|\b\d+(?:\.\d+)?\b)/gm
            : lang === "bash"
                ? /(#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$(?:\{[A-Za-z_][A-Za-z0-9_]*\}|[A-Za-z_][A-Za-z0-9_]*)|\b(?:if|then|else|fi|for|in|do|done|while|case|esac|function|return|echo|export|local)\b|\b\d+(?:\.\d+)?\b)/gm
                : /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|extends|import|from|export|default|await|async|try|catch|finally|throw|null|undefined|true|false)\b|\b\d+(?:\.\d+)?\b)/gm;

        let cursor = 0;
        for (const match of source.matchAll(pattern)) {
            const token = match[0];
            const at = match.index || 0;
            if (at > cursor) {
                codeEl.appendChild(document.createTextNode(source.slice(cursor, at)));
            }

            const span = document.createElement("span");
            span.className = classifyCodeToken(token, lang);
            span.textContent = token;
            codeEl.appendChild(span);
            cursor = at + token.length;
        }

        if (cursor < source.length) {
            codeEl.appendChild(document.createTextNode(source.slice(cursor)));
        }
    }

    function classifyCodeToken(token, language) {
        if (language === "python") {
            if (token.startsWith("#")) {
                return "tok-comment";
            }
            if (token.startsWith("\"") || token.startsWith("'")) {
                return "tok-string";
            }
            if (/^\d/.test(token)) {
                return "tok-number";
            }
            return "tok-keyword";
        }

        if (language === "bash") {
            if (token.startsWith("#")) {
                return "tok-comment";
            }
            if (token.startsWith("$") || token.startsWith("${")) {
                return "tok-variable";
            }
            if (token.startsWith("\"") || token.startsWith("'")) {
                return "tok-string";
            }
            if (/^\d/.test(token)) {
                return "tok-number";
            }
            return "tok-keyword";
        }

        if (token.startsWith("//") || token.startsWith("/*")) {
            return "tok-comment";
        }
        if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) {
            return "tok-string";
        }
        if (/^\d/.test(token)) {
            return "tok-number";
        }
        return "tok-keyword";
    }

    window.MarkdownRenderer = Object.freeze({
        renderInto: renderMarkdownInto
    });
})();
