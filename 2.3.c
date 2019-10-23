#include <stdio.h>
#include <stdlib.h>
#include <time.h>

	typedef struct{
		char nome;
		char vitorias;
		char cor;

	}jogador;

	void jogada1();
	void jogada2();

int main(){
	int pt;
	int tab[x][y];
	jogador player1;
	jogador player2;
	srand(time(NULL));
	int num;
	char x[],y[];
	char P[] = {'P'};
	char B[] = {'B'};

	printf("Insira o nome do primeiro jogador: ");
	scanf("%s",player1.nome);
	printf("\n");

	printf("Insira o nome do segundo jogador: ");
	scanf("%s",player2.nome);
	printf("\n");

	int nump;
	printf("Insira o número de partidas: \n");
	scanf("%d",&nump);

	num = rand()%2;

	if(num==0){
		printf("Jogador 1 começa.\n");
		player1.cor == P;
		player2.cor == B;
		jogada1();

	}else{
		printf("Jogador 2 começa.\n");
		player2.cor == P;
		player1.cor == B;
		jogada2();
	}

	for(int i=0; i<=nump ;i++)
	{
		if(nump%2==0){
			jogada1()
		}else{
			jogada2()
		}
	}


	return 0;
}



void jogada1(){

	int tab[x][y];
	printf("VEZ DO JOGADOR 1\n");
	printf("Insira uma linha: \n");
	scanf("%d",&x);
	printf("Insira uma coluna\n");
	scanf("%d",&y);
	if(tab[x][y] == {'-'}){
		tab[x][y] = P;
	}else{
		printf("ESPAÇO JÁ OCUPADO\n");
		jogada2();
}
}
void jogada2(){

	int tab[x][y];
	printf("VEZ DO JOGADOR 2\n");
	printf("Insira uma linha: \n");
	scanf("%d",&x);
	printf("Insira uma coluna\n");
	scanf("%d",&y);
	if(tab[x][y] == '-'){
		tab[x][y] = B;
	}else{
		printf("ESPAÇO JÁ OCUPADO\n");
		jogada2();
	}
}