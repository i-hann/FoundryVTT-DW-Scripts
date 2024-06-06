
async function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getDungeonName() {
    // Start with template
    var template = await game.tables.getName("Dungeon Name Template").draw({ displayChat: false });
    template = template.results[0].data.text;

    // Get a potential place, noun, and adjective
    var place = await game.tables.getName("Dungeon Name Place").draw({ displayChat: false });
    place = place.results[0].data.text;
    var noun = await game.tables.getName("Dungeon Name Noun").draw({ displayChat: false });
    noun = noun.results[0].data.text;
    var adjective = await game.tables.getName("Dungeon Name Adjective").draw({ displayChat: false });
    adjective = adjective.results[0].data.text;

    // Populate Words
    var dungeon_name = template;
    dungeon_name = await dungeon_name.replace("[Place]", place);
    dungeon_name = await dungeon_name.replace("[Noun]", noun);
    dungeon_name = await dungeon_name.replace("[Adjective]", adjective);

    return dungeon_name;    
}

async function getDungeonSize() {
    var size = await game.tables.getName("Dungeon Size").draw({ displayChat: false });
    return size.results[0].data.text;
}

async function getDungeonForm() {
    var form = await game.tables.getName("Dungeon Form").draw({ displayChat: false });
    return form.results[0].data.text;
}

async function getDungeonThemeCount(size) {
    var theme_count;
    switch (size) {
        case "small":
            theme_count = 2;
            break;
        case "medium":
            theme_count = 3;
            break;
        case "large":
            theme_count = 4;
            break;
        case "huge":
            theme_count = 5;
            break;
        default:
            theme_count = 2;
            break;
    }
    return theme_count;
}

async function getDungeonRoomCount(size) {
    var room_count;
    switch (size) {
        case "small":
            room_count = await getRandomNumber(2, 7);
            break;
        case "medium":
            room_count = await getRandomNumber(7, 15);
            break;
        case "large":
            room_count = await getRandomNumber(16, 25);
            break;
        case "huge":
            room_count = await getRandomNumber(26, 37);
            break;
        default:
            room_count = await getRandomNumber(7, 15);
            break;
    }
    return room_count;
}

async function getDungeonTheme() {
    var theme = await game.tables.getName("Dungeon Theme").draw({ displayChat: false });
    return theme.results[0].data.text;
}

async function main() {
    // Get basic dungeon properties
    var dungeon_name = await getDungeonName();
    var dungeon_size = await getDungeonSize();
    var dungeon_form = await getDungeonForm();

    // Get themes appropriate for size
    var dungeon_theme_count = await getDungeonThemeCount(dungeon_size);
    var dungeon_themes = [];
    for (var i = 0; i < dungeon_theme_count; i++) {
        dungeon_themes[i] = await getDungeonTheme();
    }

    // Get room count appropriate for size
    var dungeon_room_count = await getDungeonRoomCount(dungeon_size);

    // Convert themes to string
    var theme_sentence = dungeon_themes[0];
    for (var j = 1; j < dungeon_themes.length; j++) {
        theme_sentence = theme_sentence + ', ' + dungeon_themes[j];
    }

    var sentence = `<p>
        <b>Name:</b> ${dungeon_name} <br>
        <b>Form:</b> ${dungeon_form} <br>
        <b>Size:</b> ${dungeon_size} (${dungeon_room_count} rooms) <br>
        <b>Themes:</b> ${theme_sentence} <br>
    </p>`

    const chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: sentence
    };

    ChatMessage.create(chatData);
}

main();