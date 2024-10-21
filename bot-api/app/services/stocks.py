import requests
from bs4 import BeautifulSoup

class Stocks():

    def __init__(self):
        response = requests.get('https://httpbin.org/user-agent')
        self.headers = {
            "User-Agent": response.json()['user-agent']
        }

    def make_request(self, endpoint):
        
        url = f'https://finance.yahoo.com{endpoint}'
        response = requests.get(url, headers=self.headers)

        return BeautifulSoup(response.text, 'html.parser')
    

    def get_price(self, ticker):

        endpoint = f'/quote/{ticker}'
        soup = self.make_request(endpoint)

        name = soup.find('h1', {'class': 'yf-3a2v0c'}).text
        price = soup.find('fin-streamer', {'class': 'livePrice'}).span.text
        change = soup.find_all('span', {'class': 'change'})

        return {
            'name': name,
            'price': price,
            'change': change[0].text,
            'change_percent': change[1].text,
            'positive': True if change[0].text[0] == "+" else False
        }
