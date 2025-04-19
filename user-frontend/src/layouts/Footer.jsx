import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-8  border-gray-200">
      
      {/* Popular Searches Section */}
      {/* <div className=" mx-auto text-center md:text-left mb-4 border-b-2 border-t-2  p-4">
        <h2 className="font-bold text-lg mb-2">Popular Searches</h2>
        <p className="text-sm text-white"><strong>Products:</strong> Bottle gourd | Lady finger | Potato | Lemon | Dalchini | Fennel seeds | Blueberry | Papaya | Dragon fruit</p>
        <p className="text-sm text-white"><strong>Brands:</strong> Yakult | My Muse | Aashirvaad Atta | Too Yumm | Lays | Figaro Olive Oil | Nandini Milk | Amul | Mother Dairy Near Me | Fortune Oil</p>
        <p className="text-sm text-white"><strong>Categories:</strong> Grocery | Curd | Hukka flavour | Paan shop near me | Eggs price | Cheese slice | Fresh fruits | Fresh vegetables | Refined oil | Butter price | Paneer price</p>
      </div> */}
      
      {/* Categories Section */}
      <div className=" mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-white text-sm text-center md:text-left mb-6 border-b-2 border-t-2  p-2">
        {[
          "Fruits & Vegetables", "Atta, Rice, Oil & Dals", "Masala & Dry Fruits", "Sweet Cravings", "Frozen Food & Ice Creams",
          "Baby Food", "Dairy, Bread & Eggs", "Cold Drinks & Juices", "Munchies", "Meats, Fish & Eggs",
          "Breakfast & Sauces", "Tea, Coffee & More", "Biscuits", "Makeup & Beauty", "Bath & Body",
          "Cleaning Essentials", "Home Needs", "Electricals & Accessories", "Hygiene & Grooming", "Health & Baby Care",
          "Homegrown Brands", "Paan Corner"
        ].map((item, index) => (
          <div key={index} className="p-2">{item}</div>
        ))}
      </div>

      {/* Footer Bottom Section */}
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
        {/* Logo & Social Icons */}
        <div>
          <h1 className="text-3xl font-bold text-white">Exclusive</h1>
          <div className="flex justify-center md:justify-start space-x-4 mt-4 text-white">
            <i className="fab fa-instagram text-xl"></i>
            <i className="fab fa-twitter text-xl"></i>
            <i className="fab fa-facebook text-xl"></i>
            <i className="fab fa-linkedin text-xl"></i>
          </div>
       
        </div>

        {/* Links Section */}
        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="text-sm space-y-2 text-white">
            {['Home', 'Delivery Areas', 'Careers', 'Customer Support', 'Press'].map((link, i) => <li key={i}>{link}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Policies</h3>
          <ul className="text-sm space-y-2 text-white">
            {['Privacy Policy', 'Terms of Use', 'Responsible Disclosure', 'Mojo - a Zepto Blog'].map((link, i) => <li key={i}>{link}</li>)}
          </ul>
        </div>

        {/* Download App Section */}
        <div>
          <h3 className="font-semibold mb-2">Download App</h3>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <button className="flex items-center space-x-2 border p-2 rounded-md w-48">
              <img src="data:image/jpeg;base64,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" alt="Play Store" className="w-6" />
              <span>Get it on Play Store</span>
            </button>
            <button className="flex items-center space-x-2 border p-2 rounded-md w-48">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftQbkNsN5jYJrfuHbcxdf9Bu65guUribIgQ&s" alt="App Store" className="w-6" />
              <span>Get it on App Store</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
