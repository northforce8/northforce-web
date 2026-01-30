# Git Repository Byte - Instruktionsguide

## Nuvarande Status

Detta projekt är nu **KLART** att pushas till det nya **NorthForce-Portal** repot.

### Vad Jag Har Gjort

1. ✅ Initierat git repository lokalt
2. ✅ Lagt till alla filer (199 filer)
3. ✅ Skapat första commit: "Initial commit - NorthForce website (public)"
4. ✅ Bytt branch till `main`
5. ✅ Konfigurerat remote till: `https://github.com/northforce8/NorthForce-Portal.git`

### Vad Du Behöver Göra Nu

#### Steg 1: Pusha Till NorthForce-Portal

Öppna terminalen i detta projekt och kör:

```bash
git push -u origin main
```

Om du får autentiseringsfel, kan du behöva:
- Logga in med GitHub CLI: `gh auth login`
- Eller använda personal access token

#### Steg 2: Verifiera På GitHub

1. Gå till: https://github.com/northforce8/NorthForce-Portal
2. Kontrollera att alla filer finns där
3. Kontrollera att commit historiken ser rätt ut

#### Steg 3: Koppla Det Gamla Projektet Till northforce-web

Nu när detta projekt är kopplat till NorthForce-Portal, är "northforce-web" repot **FRITT** och kan kopplas till det gamla projektet.

**I det gamla projektet (där båda portalerna ligger):**

```bash
# Navigera till det gamla projektet
cd /path/to/gamla-projektet

# Kontrollera nuvarande remote
git remote -v

# Om det pekar på fel repo, uppdatera remote URL
git remote set-url origin https://github.com/northforce8/northforce-web.git

# Pusha till northforce-web
git push -u origin main
```

## Varför Detta Löser Problemet

**Tidigare:**
- Både detta projekt OCH det gamla projektet försökte använda "northforce-web" repot
- GitHub tillåter inte samma repo på två ställen samtidigt
- Det skapade konflikten du såg med branch namnet "northforce-web/NorthForce-Portal"

**Nu:**
- Detta projekt (webbsidan) → **NorthForce-Portal** repo
- Gamla projektet (portaler) → **northforce-web** repo
- Två separata repositories, inga konflikter

## Verifiera Att Allt Fungerar

### För Detta Projekt (Webbsidan)
```bash
git status
git remote -v
# Ska visa: origin https://github.com/northforce8/NorthForce-Portal.git
```

### För Gamla Projektet (Portaler)
```bash
cd /path/to/gamla-projektet
git status
git remote -v
# Ska visa: origin https://github.com/northforce8/northforce-web.git
```

## Om Du Stöter På Problem

### Problem: "Repository not found"
**Lösning:** Kontrollera att repot finns på GitHub och att du har åtkomst.

### Problem: Autentiseringsfel
**Lösning:**
```bash
gh auth login
# eller
git config credential.helper store
```

### Problem: "Branch already exists"
**Lösning:**
```bash
# Om det finns gamla branches, kan du behöva:
git push origin main --force
# (Var försiktig med --force, använd endast om du är säker)
```

## Nästa Steg Efter Bytet

1. ✅ Uppdatera Netlify/deployment för webbsidan att peka på NorthForce-Portal
2. ✅ Uppdatera dokumentation med nya repo-länkar
3. ✅ Informera teamet om den nya strukturen

## Frågor?

Om något är oklart eller om du stöter på problem, låt mig veta så hjälper jag dig vidare!
