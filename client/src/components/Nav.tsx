import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {AiOutlineUser} from 'react-icons/ai';
import {IoLogoGameControllerA} from 'react-icons/io';

type Props = {
  title: string;
  options: string[];
  links: string[];
};

const Nav = () => {
  return (
    <nav className="sticky top-0 w-auto bg-teal-300 text-black border-b-2 border-teal-400">
      <div className=" grid grid-cols-3 text-xl text-custom-blue font-semibold">

        <DropdownMenu
        title={'User'}
          options={["Login", "Register", "Sign Out"]}
          links={["/user/login", "/user/register", "/user/logout"]}
        />

        <a href="/" className="relative inline-block py-2 text-teal-800 text-center items-center object-center italic">ThesauRACE</a>
        <DropdownMenu
         title={'Games'}
          options={["Solo", "Versus"]}
          links={["/solo", "/versus"]}
        />
      </div>
    </nav>
  );
};

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

const DropdownMenu: React.FC<Props> = ({ options, links, title }) => {
  return (
    <Menu as="div" className="relative inline-block py-1 text-black text-center items-center object-center">
      <div>
        <Menu.Button className="inline-flex w-1/10 justify-center rounded-md  bg-teal-100 px-4 py-2  hover:bg-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400">
         {title === "User" ? <AiOutlineUser/> : <IoLogoGameControllerA/>} 
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
 
        <Menu.Items className="absolute right-[42%] z-10 mt-2 w-36 origin-top-right text-center rounded-md bg-teal-100 shadow-lg ring-1 ring-teal-400 ring-opacity-5 focus:outline-none">
         
          <div className="py-1">
            <>
          {options.map(function (option, i) {return DropdownMenuItem(option, links[i])})}       
            </>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};


//Iterates over each item for the menu and adds links as href
const DropdownMenuItem = (option: string, itemLink: string) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={itemLink}
          className={classNames(
            active ? "bg-teal-400 text-black" : "text-black",
            "block px-4 py-2 text-sm"
          )}
        >
          {option}
        </a>
      )}
    </Menu.Item>
  );
};

export default Nav;

