import inquirer from 'inquirer';
import { exec } from 'child_process';
const mainMenu = async () => {
  console.log('Ana menü\n');

  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Hangi Hız testini İstersiniz?',
    choices: [
      'Fast-test',
      new inquirer.Separator(),
      'Çıkış'
    ]
  });

  switch (choice) {
    case 'Fast-test':
      console.log('Hız testi başlatılıyor...');
      const fasttest = exec('fast --upload');
      let lastLine = '';
      fasttest.stdout.on('data', (data) => {
        // Son satırı güncelle
        const lines = data.trim().split('\n');
        lastLine = lines[lines.length - 1];
        process.stdout.write(`\r${lastLine}`);
      });
      fasttest.stderr.on('data', (data) => {
        console.error(`Hata oluştu: ${data}`);
      });
      fasttest.on('exit', (code) => {
        console.log(`\nHız testi tamamlandı (çıkış kodu ${code}).`);
        inquirer.prompt({
          type: 'confirm',
          name: 'backToMainMenu',
          message: 'Ana menüye dönmek ister misiniz?',
          default: true
        }).then(async ({ backToMainMenu }) => {
          if (backToMainMenu) {
            console.clear();
            await mainMenu();
          } else {
            console.log('Programdan çıkılıyor...');
            process.exit();
          }
        });
      });
      break;
	  
	  
	  
  case 'Çıkış':
  console.log('Programdan çıkılıyor...');
  break;

    default:
      console.log('Geçersiz seçim.');
      break;
  }
};

mainMenu();
