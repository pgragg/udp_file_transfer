txtEquality:
	@git diff src/files/smol.txt src/files/smolCopy.txt | wc -l

pdfEquality:
	@git diff src/files/typescript.pdf src/files/typescriptCopy.pdf | wc -l


write: 
	npm run write

read:
	rm -f src/files/smolCopy.txt || true && \
	rm -f src/files/typescriptCopy.pdf || true && \
	npm run read && \
	$(MAKE) pdfEquality
