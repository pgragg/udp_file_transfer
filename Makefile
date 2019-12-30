equality:
	@git diff src/files/smol.txt src/files/smolCopy.txt | wc -l

write: 
	npm run write

read:
	rm -f src/files/smolCopy.txt || true && npm run read && $(MAKE) equality
